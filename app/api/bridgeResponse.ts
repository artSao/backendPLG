import { NextResponse } from "next/server";

// Fungsi universal untuk response success/error dengan dukungan headers
export function getResponse(
  error: number,
  message: string,
  status: number,
  data?: unknown,
  headers: Record<string, string> = {}
) {
  return new NextResponse(
    JSON.stringify({
      metadata: {
        error,
        message,
        status,
      },
      data: data || null,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}
