import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        studentId: params.studentId,
      },
      include: {
        student: {
          select: {
            name: true,
            usn: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching student posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch student posts" },
      { status: 500 }
    );
  }
}
