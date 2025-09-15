import { NextResponse } from "next/server";

const BACKEND_URL = "http://127.0.0.1:8000/api/listings/";

export async function GET() {
  const res = await fetch(BACKEND_URL);
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}