import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { wsHandler } from '@/lib/websocket';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Define interface for message attachments
interface MessageAttachment {
  url: string;
  type: string;
  name: string;
  size?: number;
}

// Get messages for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");

    // Try Prisma first, fall back to direct MongoDB if needed
    try {
      if (otherUserId) {
        // Get messages between current user and other user using Prisma
        const messages = await prisma.message.findMany({
          where: {
            OR: [
              { 
                senderId: session.user.id,
                receiverId: otherUserId
              },
              {
                senderId: otherUserId,
                receiverId: session.user.id
              }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            receiver: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        });

        // Mark messages as read
        await prisma.message.updateMany({
          where: {
            senderId: otherUserId,
            receiverId: session.user.id,
            read: false
          },
          data: {
            read: true
          }
        });

        // Transform the data to match the expected format
        const formattedMessages = messages.map(msg => ({
          id: msg.id,
          content: msg.content || '',
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          read: msg.read,
          createdAt: msg.createdAt.toISOString(),
          updatedAt: msg.updatedAt.toISOString(),
          status: msg.status || 'sent',
          attachments: Array.isArray(msg.attachments) ? msg.attachments as unknown as MessageAttachment[] : [],
          sender: {
            id: msg.sender.id,
            name: msg.sender.name || 'Unknown',
            image: msg.sender.image || ''
          },
          receiver: {
            id: msg.receiver.id,
            name: msg.receiver.name || 'Unknown',
            image: msg.receiver.image || ''
          }
        }));

        return NextResponse.json(formattedMessages);
      }
      
      // If using all conversations or Prisma fails, continue with MongoDB implementation
    } catch (prismaError) {
      console.error("[PRISMA_MESSAGES_GET]", prismaError);
      // Fall back to MongoDB implementation
    }

    // MongoDB fallback implementation
    const client = await clientPromise;
    const db = client.db("unimatch_db");

    let messages;
    if (otherUserId) {
      // Get messages between current user and other user
      messages = await db.collection("Message").find({
        $or: [
          { 
            senderId: new ObjectId(session.user.id),
            receiverId: new ObjectId(otherUserId)
          },
          {
            senderId: new ObjectId(otherUserId),
            receiverId: new ObjectId(session.user.id)
          }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

      // Fetch users separately
      const [sender, receiver] = await Promise.all([
        db.collection("User").findOne(
          { _id: new ObjectId(session.user.id) },
          { projection: { _id: 1, name: 1, image: 1 } }
        ),
        db.collection("User").findOne(
          { _id: new ObjectId(otherUserId) },
          { projection: { _id: 1, name: 1, image: 1 } }
        )
      ]);

      // Mark messages as read
      try {
        await db.collection("Message").updateMany(
          {
            senderId: new ObjectId(otherUserId),
            receiverId: new ObjectId(session.user.id),
            read: false
          },
          {
            $set: { read: true }
          }
        );
      } catch (error) {
        console.error("[MESSAGES_READ_UPDATE]", error);
      }

      // Attach user details to messages
      messages = messages.map(msg => {
        return {
          ...msg,
          id: msg._id?.toString() || msg.id,
          senderId: (msg.senderId?._id?.toString() || msg.senderId?.toString() || msg.senderId),
          receiverId: (msg.receiverId?._id?.toString() || msg.receiverId?.toString() || msg.receiverId),
          sender: msg.senderId.toString() === session.user.id ? 
            { 
              id: sender?._id?.toString() || sender?.id || session.user.id, 
              name: sender?.name || "Unknown", 
              image: sender?.image || "" 
            } : 
            { 
              id: receiver?._id?.toString() || receiver?.id || otherUserId, 
              name: receiver?.name || "Unknown", 
              image: receiver?.image || "" 
            },
          receiver: msg.receiverId.toString() === session.user.id ? 
            { 
              id: sender?._id?.toString() || sender?.id || session.user.id, 
              name: sender?.name || "Unknown", 
              image: sender?.image || "" 
            } : 
            { 
              id: receiver?._id?.toString() || receiver?.id || otherUserId, 
              name: receiver?.name || "Unknown", 
              image: receiver?.image || "" 
            }
        };
      });
    } else {
      // Get all conversations
      messages = await db.collection("Message").aggregate([
        {
          $match: {
            $or: [
              { senderId: new ObjectId(session.user.id) },
              { receiverId: new ObjectId(session.user.id) }
            ]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $lookup: {
            from: "User",
            localField: "senderId",
            foreignField: "_id",
            as: "sender"
          }
        },
        {
          $lookup: {
            from: "User",
            localField: "receiverId",
            foreignField: "_id",
            as: "receiver"
          }
        },
        {
          $unwind: "$sender"
        },
        {
          $unwind: "$receiver"
        },
        {
          $project: {
            _id: 1,
            content: 1,
            senderId: 1,
            receiverId: 1,
            read: 1,
            createdAt: 1,
            updatedAt: 1,
            "sender._id": 1,
            "sender.name": 1,
            "sender.image": 1,
            "receiver._id": 1,
            "receiver.name": 1,
            "receiver.image": 1
          }
        }
      ]).toArray();

      // Transform IDs to strings
      messages = messages.map(msg => {
        if (!msg.sender || !msg.receiver) {
          throw new Error("Failed to fetch user details");
        }
        return {
          ...msg,
          id: msg._id.toString(),
          senderId: msg.senderId.toString(),
          receiverId: msg.receiverId.toString(),
          sender: {
            id: msg.sender._id.toString(),
            name: msg.sender.name,
            image: msg.sender.image
          },
          receiver: {
            id: msg.receiver._id.toString(),
            name: msg.receiver.name,
            image: msg.receiver.image
          }
        };
      });
    }

    return NextResponse.json(messages || []);
  } catch (error) {
    console.error("[MESSAGES_GET]", error instanceof Error ? error.message : 'Unknown error');
    return new NextResponse("Failed to fetch messages", { status: 500 });
  }
}

// Send a new message
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const receiverId = formData.get("receiverId") as string;
    const files = formData.getAll("attachments") as File[];

    if (!content && files.length === 0 || !receiverId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("unimatch_db");

    // Handle file uploads if any
    const attachments = [];
    if (files.length > 0) {
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const filename = `${Date.now()}-${file.name}`;
        
        // Upload to Cloudinary instead of local file system
        const url = await uploadToCloudinary(buffer, {
          public_id: filename.split('.')[0],
          resource_type: 'auto',
          folder: 'messages'
        });
        
        attachments.push({
          url: url,
          type: file.type,
          name: file.name
        });
      }
    }

    // Create message
    const message = await db.collection("Message").insertOne({
      content: content?.trim(),
      senderId: new ObjectId(session.user.id),
      receiverId: new ObjectId(receiverId),
      read: false,
      attachments,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Fetch user details
    const [sender, receiver] = await Promise.all([
      db.collection("User").findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { _id: 1, name: 1, image: 1 } }
      ),
      db.collection("User").findOne(
        { _id: new ObjectId(receiverId) },
        { projection: { _id: 1, name: 1, image: 1 } }
      )
    ]);

    // Return message with user details
    if (!sender || !receiver) {
      throw new Error("Failed to fetch user details");
    }

    const messageWithDetails = {
      id: message.insertedId.toString(),
      content: content?.trim(),
      senderId: session.user.id,
      receiverId,
      read: false,
      attachments,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: sender._id.toString(),
        name: sender.name,
        image: sender.image
      },
      receiver: {
        id: receiver._id.toString(),
        name: receiver.name,
        image: receiver.image
      }
    };

    // Broadcast the message through WebSocket
    wsHandler.broadcastMessage(messageWithDetails);

    return NextResponse.json(messageWithDetails);
  } catch (error) {
    console.error("[MESSAGES_POST]", error instanceof Error ? error.message : 'Unknown error');
    return new NextResponse("Failed to send message", { status: 500 });
  }
} 