import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Terapkan CORS hanya untuk route API
  if (pathname.startsWith("/api/")) {
    const headers = new Headers();
    const origin = request.headers.get("origin");

    // Atur origin yang diizinkan (sesuaikan dengan kebutuhan)
    const allowedOrigins = [
      "http://localhost:3003",
      "http://pecel-lele-connect.vercel.app/",
    ];

    // Validasi origin
    if (origin && allowedOrigins.includes(origin)) {
      headers.set("Access-Control-Allow-Origin", origin);
    }

    // Header CORS
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token"
    );
    headers.set("Access-Control-Allow-Credentials", "true");

    // Handle preflight request
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers,
      });
    }

    // Tambahkan header ke response
    const response = NextResponse.next();
    headers.forEach((value, key) => response.headers.set(key, value));

    return response;
  }

  return NextResponse.next();
}
