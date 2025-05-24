import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get the student USN from the query parameters
    const { searchParams } = new URL(req.url);
    const studentUsn = searchParams.get("usn");

    if (!studentUsn) {
      return NextResponse.json(
        { error: "Student USN is required" },
        { status: 400 }
      );
    }

    // Fetch all posts for the specific student
    const posts = await prisma.post.findMany({
      where: {
        studentUsn: studentUsn,
      },
      orderBy: {
        createdAt: "desc", // Most recent posts first
      },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        isApproved: true,
        status: true,
        priority: true,
        category: true,
        analysis: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            usn: true,
          },
        },
      },
    });

    // Transform the data to match the expected format
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
        posts: formattedPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch student posts" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
