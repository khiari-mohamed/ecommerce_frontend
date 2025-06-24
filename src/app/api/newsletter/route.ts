import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, customerName, customerEmail, unsubscribeLink } = body;

  if (!to || !customerEmail) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    // Use BACKEND_API_URL from .env.local
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
      throw new Error("BACKEND_API_URL is not defined in environment variables.");
    }

    const backendRes = await fetch(
      backendUrl + "/email/send-weekly-promotion",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          customerName,
          customerEmail,
          unsubscribeLink,
        }),
      }
    );

    if (!backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json({ message: data.message || "Backend error" }, { status: backendRes.status });
    }

    return NextResponse.json({ message: "Subscribed successfully!" }, { status: 200 });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
