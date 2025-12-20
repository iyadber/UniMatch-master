import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['teacher', 'student']),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('[USERS_GET] Unauthorized request');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    console.log('[USERS_GET] Querying users with role:', role);

    const query = role ? { role } : {};

    const users = await prisma.user.findMany({
      where: query,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        // Include any custom fields from the JSON data
      }
    });

    // Check if we're looking for teachers specifically and add subject and bio fields if needed
    if (role === 'teacher') {
      // We need to perform an additional query to get any custom fields that might exist in MongoDB
      // but aren't defined in the Prisma schema

      // Log the data for debugging
      console.log('[USERS_GET] Found users before transformation:', users.length);

      // For MongoDB, we can safely assign these fields even if they don't exist in the schema
      const enhancedUsers = users.map(user => {
        return {
          ...user,
          subjects: [], // Default empty array
          bio: "" // Default empty string
        };
      });

      console.log('[USERS_GET] Enhanced users data:', JSON.stringify(enhancedUsers, null, 2));
      return NextResponse.json(enhancedUsers);
    }

    console.log('[USERS_GET] Found users:', users.length);
    console.log('[USERS_GET] Users data:', JSON.stringify(users, null, 2));

    return NextResponse.json(users);
  } catch (error) {
    console.error('[USERS_GET] Error:', error instanceof Error ? error.message : 'Unknown error');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email.toLowerCase()
      }
    });

    if (existingUser) {
      return new NextResponse('User with this email already exists', { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('[USERS_POST]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors[0].message, { status: 400 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
}