import { NextResponse } from "next/server";
import { basename } from "path";
import { TrmnlRequest } from "../../lib/TrmnlRequest";

type TrmnlDevice = {
    reset_firmware: boolean;
    update_firmware: boolean;
    firmware_url: string;
    special_function: string;
};

type TrmnlDisplayOptions = {
    url: string;
    refreshRate: number;
};

export class Trmnl {
    host: string;

    constructor(request: TrmnlRequest, private device?: Partial<TrmnlDevice>) {
        const host = request.nextRequest.headers.get("host");
        if (!host) {
            throw new Error("No host header");
        }

        this.host = host;
    }

    display(image: TrmnlDisplayOptions) {
        const isBase64 = image.url.startsWith("data:image/bmp;base64,");

        return NextResponse.json({
            status: 0,
            image_url: image.url,
            filename: isBase64 ? "" : basename(image.url),
            refresh_rate: image.refreshRate,
            reset_firmware: this.device?.reset_firmware ?? false,
            update_firmware: this.device?.update_firmware ?? false,
            firmware_url: this.device?.firmware_url ?? null,
            special_function:
                this.device?.special_function ?? "restart_playlist"
        });
    }
}
