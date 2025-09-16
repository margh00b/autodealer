import { NextResponse } from "next/server";
import { testR2Connection } from "@/lib/r2-client";

export async function GET() {
  const result = await testR2Connection();
  return NextResponse.json({ success: result });
}