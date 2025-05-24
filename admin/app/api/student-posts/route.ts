import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentUsn = searchParams.get("usn");

    if (!studentUsn) {
      return NextResponse.json(
        { error: "Student USN is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // First verify if the student exists
    const student = await prisma.student.findUnique({
      where: { usn: studentUsn },
      select: { usn: true },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Get all posts for the student
    const posts = await prisma.post.findMany({
      where: {
        studentUsn: studentUsn,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        student: {
          select: {
            usn: true,
          },
        },
      },
    });

    // Format the response
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      isApproved: post.isApproved,
      status: post.status,
      priority: post.priority,
      category: post.category,
      analysis: post.analysis,
      studentUsn: post.student.usn,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        student: {
          usn: student.usn,
        },
        posts: formattedPosts,
        totalPosts: formattedPosts.length,
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching student posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch student posts" },
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
