// app/api/uploadAvatar/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  const form = await req.formData();
  const file = form.get('file');

  if (!file || !file.name) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.name);
  const fileStream = fs.createWriteStream(filePath);

  file.stream().pipe(fileStream);

  return NextResponse.json({ message: "File uploaded successfully", filePath });
}