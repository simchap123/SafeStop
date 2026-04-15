import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function getSession(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
