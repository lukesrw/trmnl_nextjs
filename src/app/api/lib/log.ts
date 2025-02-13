import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";
import { TrmnlRequest } from "./TrmnlRequest";

export async function log(request: TrmnlRequest) {
    const { searchParams: search } = new URL(request.nextRequest.url);
    const headers = Object.fromEntries(request.nextRequest.headers);
    const time = Date.now();
    let body: unknown = "";
    if (request.nextRequest.method === "POST") {
        try {
            const text = await request.nextRequest.text();

            try {
                body = JSON.parse(text);
            } catch (error) {
                body = text;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const info = {
        method: request.nextRequest.method,
        search,
        headers,
        pathname: request.nextRequest.nextUrl.pathname,
        body
    };

    /**
     * this is a temporary fix, logs will go to storage later.
     */
    if (request.isServerless) {
        console.error(JSON.stringify(info));
    } else {
        await writeFile(
            join(process.cwd(), "tmp", `${time}.json`),
            JSON.stringify(info, null, 4)
        );
    }

    return NextResponse.json(
        {
            message: "Not Found"
        },
        {
            status: 404,
            statusText: "Not Found"
        }
    );
}
