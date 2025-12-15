import { NextRequest } from "next/server";
import { getScreen } from "./getScreen";

export async function POST(request: NextRequest) {
    const data = await request.json();

    const image = await getScreen(data.config, data.mode);

    return new Response(Buffer.from(image));
}
