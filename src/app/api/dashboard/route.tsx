import { NextRequest } from "next/server";
import { TrmnlRequest } from "../lib/TrmnlRequest";
import { getScreen } from "./getScreen";

export async function POST(request: NextRequest) {
    const data = await request.json();

    const image = await getScreen(TrmnlRequest.mock(), data.config, data.mode);

    return new Response(image);
}
