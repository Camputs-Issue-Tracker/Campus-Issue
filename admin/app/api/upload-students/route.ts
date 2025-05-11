import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("❌ Authentication failed: No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Verify token
      jwt.verify(token, SECRET);
      console.log("✅ Authentication successful");
    } catch (error) {
      console.log("❌ Authentication failed: Invalid token", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("csv") as File;

    if (!file) {
      console.log("❌ No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("📄 File received:", file.name, "Size:", file.size, "bytes");

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      console.log("❌ Invalid file type:", file.name);
      return NextResponse.json(
        { error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("📦 File converted to buffer, size:", buffer.length);

    let records;
    try {
      records = parse(buffer.toString(), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
      console.log("✅ CSV parsed successfully, records found:", records.length);
    } catch (parseError) {
      console.error("❌ CSV parsing error:", parseError);
      return NextResponse.json(
        { error: "Invalid CSV format" },
        { status: 400 }
      );
    }

    if (!records || records.length === 0) {
      console.log("❌ CSV file is empty");
      return NextResponse.json({ error: "CSV file is empty" }, { status: 400 });
    }

    console.log("📋 First record sample:", records[0]);

    const inserted = [];
    const errors = [];

    for (const row of records) {
      if (!row.usn || !row.password) {
        const errorMsg = `Missing required fields for row: ${JSON.stringify(
          row
        )}`;
        console.log("❌", errorMsg);
        errors.push(errorMsg);
        continue;
      }

      try {
        const created = await prisma.student.create({
          data: {
            usn: row.usn.trim(),
            password: row.password.trim(),
          },
        });
        console.log("✅ Inserted student:", created.usn);
        inserted.push(created);
      } catch (err) {
        const errorMsg = `Failed to insert student with USN: ${row.usn}`;
        console.error("❌", errorMsg, err);
        errors.push(errorMsg);
      }
    }

    console.log("📊 Upload summary:", {
      total: records.length,
      inserted: inserted.length,
      errors: errors.length,
    });

    return NextResponse.json({
      success: true,
      inserted: inserted.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
