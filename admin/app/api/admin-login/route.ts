import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  console.log("🔑 Login attempt for:", email);

  if (
    email === process.env.SUPER_ADMIN_EMAIL &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    // Create JWT token with more specific payload
    const token = jwt.sign(
      {
        email,
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
      },
      SECRET,
      { expiresIn: "1h" }
    );

    // Create response with success status
    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );

    // Set cookie with proper security settings
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour in seconds
    });

    console.log("✅ Login successful, token set");
    return response;
  }

  console.log("❌ Login failed: Invalid credentials");
  return NextResponse.json(
    { success: false, error: "Invalid credentials" },
    { status: 401 }
  );
}
