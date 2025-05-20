import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Get posts for a specific student
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usn = searchParams.get("usn");

    if (!usn) {
      return NextResponse.json(
        { error: "USN is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        studentUsn: usn,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ posts }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, imageUrl, studentUsn } = body;

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

    // Analyze the post content using GPT
    const analysisPrompt = `Analyze the following campus issue report and provide:
1. Priority level (urgent, high, medium, low)
2. Category (academic, infrastructure, facility, other)
3. Brief analysis of the issue

Title: ${title}
Content: ${content}

Respond in JSON format:
{
  "priority": "priority_level",
  "category": "category",
  "analysis": "brief_analysis"
}`;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at analyzing campus issues and determining their priority and category.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.7,
    });

    const gptContent = gptResponse.choices[0].message.content;
    if (!gptContent) {
      throw new Error("GPT analysis failed to generate content");
    }

    const analysisResult = JSON.parse(gptContent) as {
      priority: string;
      category: string;
      analysis: string;
    };

    // Create the post with GPT analysis
    type PostCreateData = {
      title: string;
      content: string;
      imageUrl?: string | null;
      studentUsn: string;
      priority?: string | null;
      category?: string | null;
      analysis?: string | null;
    };

    const postData: PostCreateData = {
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
