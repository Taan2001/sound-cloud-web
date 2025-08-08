import { NextRequest, NextResponse } from "next/server";
import { sendRequest } from "@/utils/api";

export async function GET(request: NextRequest, response: NextResponse) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  return await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${searchParams.get("audio")}`
  );
}
