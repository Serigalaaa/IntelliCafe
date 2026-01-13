import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure the directory exists
    const uploadDir = path.join(process.cwd(), "public", "images")
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore error if directory exists
    }

    // Create a clean filename (e.g., my-image.jpg)
    // You could also add a timestamp to make it unique: `${Date.now()}-${file.name}`
    const filename = file.name.replace(/\s+/g, "-").toLowerCase()
    const filepath = path.join(uploadDir, filename)

    // Write file to the public/images folder
    await writeFile(filepath, buffer)

    // Return the path that the frontend needs (e.g., /images/filename.jpg)
    return NextResponse.json({ success: true, path: `/images/${filename}` })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}