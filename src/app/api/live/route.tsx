import { WhiteHouseResponse } from "@/utils/lib/WhiteHouseResponse";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";
import { display } from "../[...parts]/lib/display";
import { TrmnlRequest } from "../lib/TrmnlRequest";

export async function GET(request: NextRequest) {
    try {
        return await display(new TrmnlRequest(request));
    } catch (error) {
        console.error(error);

        WhiteHouseResponse.attemptNextResponse(error);
    }

    return WhiteHouseResponse.toNextResponse({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        developerMessage: "Live preview failed to render an image",
        userMessage: "Unfortunately we can't show you a preview at this time",
        errorCode: "UNHANDLED-LIVE-PREVIEW"
    });
}
