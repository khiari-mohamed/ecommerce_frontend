import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/aromas`);
  const data = await response.json();


  return NextResponse.json(data);
}