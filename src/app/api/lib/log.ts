import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function log(request: NextRequest) {
    const { searchParams: search } = new URL(request.url);
    const headers = Object.fromEntries(request.headers);
    const time = Date.now();
    let body = "";
    if (request.method === "POST") {
        try {
            body = await request.text();
        } catch (error) {
            console.error(error);
        }
    }

    await writeFile(
        join(process.cwd(), "tmp", `${time}.json`),
        JSON.stringify(
            {
                method: request.method,
                search,
                headers,
                pathname: request.nextUrl.pathname,
                body
            },
            null,
            4
        )
    );

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
