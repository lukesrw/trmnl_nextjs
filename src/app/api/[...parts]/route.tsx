import { WhiteHouseResponse } from "@/utils/lib/WhiteHouseResponse";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";
import { log } from "../lib/log";
import { TrmnlRequest } from "../lib/TrmnlRequest";
import { display } from "./lib/display";

type PageProps = { params: Promise<{ parts: string[] }> };

/**
 * Catch-all route for handling TRMNL requests.
 *
 * Allows for forwarding requests to usetrmnl.com if unhandled.
 */

export async function GET(request: NextRequest, props: PageProps) {
    const trmnlRequest = new TrmnlRequest(request);

    /**
     * Return forbidden if the request is not from a TRMNL device.
     */
    if (!trmnlRequest.isTrmnl) {
        return WhiteHouseResponse.toNextResponse({
            status: StatusCodes.FORBIDDEN,
            developerMessage: "Endpoint is only for TRMNL devices",
            userMessage: "Please contact support for assistance",
            errorCode: "FORBIDDEN-TRMNL-ONLY"
        });
    }

    try {
        const { parts } = await props.params;
        switch (parts.join("/")) {
            case "display":
                return await display(trmnlRequest);

            case "display-tmp":
                /**
                 * @todo add method for serving images from tmp directory
                 */
                break;
        }
    } catch (error) {
        WhiteHouseResponse.attemptNextResponse(error);
    }

    return WhiteHouseResponse.toNextResponse({
        status: StatusCodes.SERVICE_UNAVAILABLE,
        developerMessage: "Unable to handle GET request",
        userMessage: "Please contact support for assistance",
        errorCode: "UNSUPPORTED-ENDPOINT-GET"
    });
}

export async function POST(request: NextRequest, props: PageProps) {
    const trmnlRequest = new TrmnlRequest(request);

    /**
     * Return forbidden if the request is not from a TRMNL device.
     */
    if (!trmnlRequest.isTrmnl) {
        return WhiteHouseResponse.toNextResponse({
            status: StatusCodes.FORBIDDEN,
            developerMessage: "Endpoint is only for TRMNL devices",
            userMessage: "Please contact support for assistance",
            errorCode: "FORBIDDEN-TRMNL-ONLY"
        });
    }

    try {
        const { parts } = await props.params;
        switch (parts.join("/")) {
            case "log":
                await log(request);

                return new Response(null, { status: StatusCodes.NO_CONTENT });
        }
    } catch (error) {
        WhiteHouseResponse.attemptNextResponse(error);
    }

    return WhiteHouseResponse.toNextResponse({
        status: StatusCodes.SERVICE_UNAVAILABLE,
        developerMessage: "Unable to handle POST request",
        userMessage: "Please contact support for assistance",
        errorCode: "UNSUPPORTED-ENDPOINT-POST"
    });
}
