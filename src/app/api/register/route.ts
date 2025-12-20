import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Define validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['teacher', 'student']).default('student'),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password consistently with bcryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(validatedData.password, salt);
    
    // Log password details for debugging
    console.log("Registration - password hash info:", {
      passwordLength: validatedData.password.length,
      hashPrefix: hashedPassword.substring(0, 10) + "...",
      saltRounds: 10
    });

    // Create new user with Prisma
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: newUser
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to register user' },
      { status: 500 }
    );
  }
} 