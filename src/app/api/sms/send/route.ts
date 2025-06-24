// template_front/src/app/api/sms/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();
  // Correct backend endpoint:
  await axios.post(`${process.env.BACKEND_URL}/clients/sms/send`, { to, message });
  return NextResponse.json({ success: true });
}