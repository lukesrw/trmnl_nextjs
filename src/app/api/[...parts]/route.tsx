import { WhiteHouseResponse } from "@/utils/lib/WhiteHouseResponse";
import { readFile } from "fs/promises";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { log } from "../lib/log";
import { TrmnlRequest } from "../lib/TrmnlRequest";
import { display } from "./lib/display";
import { ImageStorage } from "./lib/ImageStorage";

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
    if (!trmnlRequest.isTrmnl && !request.nextUrl.searchParams.has("force")) {
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
            case "setup":
                return NextResponse.json({
                    status: StatusCodes.OK,
                    api_key: trmnlRequest.accessToken,
                    friendly_id: trmnlRequest.id,
                    image_url: "",
                    message: ""
                });

            case "display":
                await log(trmnlRequest);

                return await display(trmnlRequest);

            case "display-tmp":
                const fileName = request.nextUrl.searchParams.get("image");
                if (!fileName) {
                    return WhiteHouseResponse.toNextResponse({
                        status: StatusCodes.BAD_REQUEST,
                        developerMessage:
                            "Request is missing `image` GET argument",
                        userMessage: "Oops, we couldn't find that image!",
                        errorCode: "DISPLAY-TMP-NO-IMAGE"
                    });
                }

                try {
                    const image = await readFile(
                        join(
                            ImageStorage.getDirectory(
                                trmnlRequest.isServerless
                            ),
                            fileName
                        )
                    );

                    return new Response(image, {
                        headers: {
                            "Content-Type": "image/bmp",
                            "Content-Length": String(image.byteLength)
                        }
                    });
                } catch (error) {
                    return WhiteHouseResponse.attemptNextResponse(error);
                }

            default:
                await log(trmnlRequest);
        }
    } catch (error) {
        return WhiteHouseResponse.attemptNextResponse(error);
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
    if (!trmnlRequest.isTrmnl && !request.nextUrl.searchParams.has("force")) {
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
                await log(trmnlRequest);

                return new Response(null, { status: StatusCodes.NO_CONTENT });

            default:
                await log(trmnlRequest);
        }
    } catch (error) {
        return WhiteHouseResponse.attemptNextResponse(error);
    }

    return WhiteHouseResponse.toNextResponse({
        status: StatusCodes.SERVICE_UNAVAILABLE,
        developerMessage: "Unable to handle POST request",
        userMessage: "Please contact support for assistance",
        errorCode: "UNSUPPORTED-ENDPOINT-POST"
    });
}
