import { NextRequest } from "next/server";

export function isServerlessRequest(request: NextRequest) {
    return request.nextUrl.hostname.endsWith("vercel.app");
}
