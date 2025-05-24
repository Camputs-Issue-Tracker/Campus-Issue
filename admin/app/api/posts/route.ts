import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { CohereClient } from "cohere-ai";
import axios from "axios";

const prisma = new PrismaClient();
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

// Function to upload image to ImageBB
async function uploadImageToImageBB(imageBase64: string) {
  try {
    const formData = new FormData();
    formData.append("image", imageBase64);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      return response.data.data.url;
    }
    throw new Error("Failed to upload image to ImageBB");
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Handle OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Get posts for a specific student
export async function GET(req: NextRequest) {
  try {
    // Get all posts with student information
    const posts = await prisma.post.findMany({
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

    // Get total counts for dashboard stats
    const totalStudents = await prisma.student.count();
    const totalPosts = posts.length;
    const totalApprovedPosts = posts.filter((post) => post.isApproved).length;
    const totalPendingPosts = posts.filter(
      (post) => post.status === "pending"
    ).length;

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalStudents,
          totalPosts,
          totalApprovedPosts,
          totalPendingPosts,
        },
        posts: formattedPosts,
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
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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

// Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, imageBase64, studentUsn } = body;
    console.log(title, content, studentUsn);

    if (!title || !content || !studentUsn) {
      return NextResponse.json(
        { error: "Title, content, and student USN are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // First check if the student exists
    const student = await prisma.student.findUnique({
      where: {
        usn: studentUsn,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found with the provided USN" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Upload image to ImageBB if provided
    let imageUrl = null;
    if (imageBase64) {
      try {
        imageUrl = await uploadImageToImageBB(imageBase64);
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // Analyze the post content using Cohere
    const analysisPrompt = `Analyze the following campus issue report and determine if it's valid. A valid report should:
1. Have a clear and specific title
2. Contain meaningful content related to campus issues
3. Not contain spam, inappropriate content, or unrelated topics

Title: ${title}
Content: ${content}

If the content is valid, provide:
1. Priority level (urgent, high, medium, low)
2. Category (academic, infrastructure, facility, other)
3. Brief analysis of the issue

If the content is invalid, respond with:
{
  "isValid": false,
  "reason": "detailed reason why the content is invalid"
}

If the content is valid, respond with:
{
  "isValid": true,
  "priority": "priority_level",
  "category": "category",
  "analysis": "brief_analysis"
}`;

    const response = await cohere.generate({
      model: "command",
      prompt: analysisPrompt,
      maxTokens: 300,
      temperature: 0.7,
      k: 0,
      stopSequences: [],
      returnLikelihoods: "NONE",
    });

    const gptContent = response.generations[0].text;

    if (!gptContent) {
      throw new Error("Cohere analysis failed to generate content");
    }

    const analysisResult = JSON.parse(gptContent) as {
      isValid: boolean;
      reason?: string;
      priority?: string;
      category?: string;
      analysis?: string;
    };

    // If content is not valid, return error response
    if (!analysisResult.isValid) {
      return NextResponse.json(
        {
          error: "Invalid post content",
          reason: analysisResult.reason,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create the post with Cohere analysis only if content is valid
    const postData = {
      title,
      content,
      imageUrl,
      studentUsn,
      priority: analysisResult.priority,
      category: analysisResult.category,
      analysis: analysisResult.analysis,
    };

    const post = await prisma.post.create({
      data: postData,
    });

    return NextResponse.json({ post }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
