import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      }
    });

    console.log("Test Auth - User found:", !!user);
    
    if (!user || !user.password) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const passwordsMatch = await bcryptjs.compare(password, user.password);
    console.log("Test Auth - Passwords match:", passwordsMatch);

    return NextResponse.json({ 
      success: passwordsMatch,
      message: passwordsMatch ? "Authentication successful" : "Invalid credentials"
    });
  } catch (error) {
    console.error("Test Auth Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
} 