import { WhiteHouseResponse } from "@/utils/lib/WhiteHouseResponse";
import { NextRequest } from "next/server";
import { getDisplay } from "../[...parts]/lib/getDisplay";
import { TrmnlRequest } from "../lib/TrmnlRequest";

export async function GET(request: NextRequest) {
    try {
        const isDebug = request.nextUrl.searchParams.has("debug");
        const trmnlRequest = new TrmnlRequest(request);

        let image: Buffer<ArrayBufferLike>;
        switch (request.nextUrl.searchParams.get("stage")) {
            case "input":
                image = await getDisplay(trmnlRequest, isDebug).toInput();
                break;

            case "frame":
            case "framed":
                image = await getDisplay(trmnlRequest, isDebug).toFramed();
                break;

            case "dither":
            case "dithered":
                image = await getDisplay(trmnlRequest, isDebug).toDithered();
                break;

            case "threshold":
            case "thresholded":
                image = await getDisplay(trmnlRequest, isDebug).toThresholded();
                break;

            default:
                image = await getDisplay(trmnlRequest, isDebug).toBmp();
        }

        return new Response(image);
    } catch (error) {
        return WhiteHouseResponse.attemptNextResponse(error);
    }
}
