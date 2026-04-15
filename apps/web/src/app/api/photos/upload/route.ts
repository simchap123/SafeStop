import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, badRequest, serverError } from "@/lib/middleware";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("sessionId") as string | null;
    const type = (formData.get("type") as string) || "confirmation";

    if (!file || !sessionId) {
      return badRequest("file and sessionId are required");
    }

    // Save file to local disk
    const uploadsDir = join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const filepath = join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const url = `/uploads/${filename}`;

    const [photo] = await db
      .insert(schema.photos)
      .values({
        sessionId,
        uploadedBy: session.user.id,
        url,
        type,
      })
      .returning();

    // If confirmation photo, update the session
    if (type === "confirmation") {
      await db
        .update(schema.tripSessions)
        .set({ confirmationPhotoUrl: url, updatedAt: new Date() })
        .where(eq(schema.tripSessions.id, sessionId));
    }

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
