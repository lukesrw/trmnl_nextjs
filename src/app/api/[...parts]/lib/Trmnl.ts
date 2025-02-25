import { NextResponse } from "next/server";
import { TrmnlRequest } from "../../lib/TrmnlRequest";

type TrmnlDevice = {
    reset_firmware: boolean;
    update_firmware: boolean;
    firmware_url: string;
    special_function: string;
};

type TrmnlDisplayOptions = {
    filename: string;
    url: string;
    refreshRate: number;
};

/**
 * Officially TRMNL supports these "special functions".
 *
 * However, only one of these is firmware-specific: "add_wifi".
 */
type TrmnlSpecialFunction =
    | "add_wifi"
    | "identify"
    | "none"
    | "restart_playlist"
    | "rewind"
    | "send_to_me"
    | "sleep";

export class Trmnl {
    host: string;
    specialFunction: string;

    constructor(request: TrmnlRequest, private device?: Partial<TrmnlDevice>) {
        const host = request.nextRequest.headers.get("host");
        if (!host) {
            throw new Error("No host header");
        }

        this.host = host;
        this.specialFunction = device?.special_function ?? "restart_playlist";
    }

    display(image: TrmnlDisplayOptions) {
        const json = {
            status: 0,
            image_url: image.url,
            filename: image.filename,
            refresh_rate: image.refreshRate,
            reset_firmware: this.device?.reset_firmware ?? false,
            update_firmware: this.device?.update_firmware ?? false,
            firmware_url: this.device?.firmware_url ?? null,
            // prettier-ignore
            special_function: this.device?.special_function ?? "restart_playlist"
        };

        if (true) {
            return NextResponse.json(json);
        }

        const jsonString = JSON.stringify(json);

        console.log(jsonString);

        return new Response(jsonString, {
            headers: {
                "Content-Type": "application/json",
                "Content-Length": String(jsonString.length)
            }
        });
    }
}
