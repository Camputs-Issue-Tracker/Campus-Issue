import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

// Handle OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usn, password } = body;
    console.log("Login attempt for USN:", usn);

    // Validate input
    if (!usn || !password) {
      return NextResponse.json(
        { error: "USN and password are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find student by USN
    const student = await prisma.student.findUnique({
      where: { usn },
      include: {
        posts: {
          where: {
            isApproved: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Check if student exists
    if (!student) {
      console.log("Student not found:", usn);
      return NextResponse.json(
        { error: "Invalid USN or password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      console.log("Invalid password for USN:", usn);
      return NextResponse.json(
        { error: "Invalid USN or password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Return student data (excluding password)
    const { password: _, ...studentWithoutPassword } = student;

    console.log("Login successful for USN:", usn);
    return NextResponse.json(
      {
        message: "Login successful",
        student: studentWithoutPassword,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
