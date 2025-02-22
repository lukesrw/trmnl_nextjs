import { screen } from "@/lib/data/TRMNL";
import { isServerlessRequest } from "@/utils/isServerlessRequest";
import { NextRequest } from "next/server";

export class TrmnlRequest {
    nextRequest!: NextRequest;

    /**
     * Derived from NextRequest.
     */
    isServerless!: boolean;

    /**
     * Properties from TRMNL requests.
     */
    accessToken!: string | null;
    batteryVoltage!: number | null;
    firmwareVersion!: string | null;
    refreshRate!: number | null;
    id!: string | null;
    rssi!: number | null;
    userAgent!: string | null;
    isSpecialFunction!: boolean;
    isBase64!: boolean;
    width!: number;
    height!: number;

    /**
     * Derived from TRMNL requests.
     */
    isTrmnl!: boolean;
    batteryPercentage!: number;

    constructor(request: NextRequest | TrmnlRequest) {
        if (request instanceof TrmnlRequest) {
            return request;
        }

        /**
         * Store the `NextRequest` for use elsewhere.
         */
        this.nextRequest = request;

        /**
         * Derive whether the request `isServerless`.
         */
        this.isServerless = isServerlessRequest(request);

        /**
         * Derive TRMNL properties.
         */
        this.accessToken = request.headers.get("access-token");
        this.batteryVoltage = Number(request.headers.get("battery-voltage"));
        this.firmwareVersion = request.headers.get("fw-version");
        this.refreshRate = Number(request.headers.get("refresh-rate"));
        this.id = request.headers.get("id");
        this.rssi = Number(request.headers.get("rssi"));
        this.userAgent = request.headers.get("user-agent");
        this.isSpecialFunction = Boolean(
            request.headers.get("special-function")
        );
        // prettier-ignore
        this.isBase64 = request.nextUrl.searchParams.get("base64") === "1";
        this.width = Number(request.headers.get("width") ?? screen.width);
        this.height = Number(request.headers.get("width") ?? screen.height);

        /**
         * Determine whether the request is from a TRMNL device.
         *
         * Note that other things cannot be relied upon:
         * - accessToken is only sent for official TRMNL endpoints
         * - most device details aren't sent as headers to `/api/log/`
         */
        this.isTrmnl = this.userAgent === "ESP32HTTPClient";

        if (this.isTrmnl) {
            /**
             * I'm not exactly sure what this value should be.
             *
             * Set as 4.82 as that's the highest I've seen on my device.
             *
             * From Discord:
             * > You should see 3.2 - 4.2V usually
             * @see https://discord.com/channels/1281055965508141100/1284989157063790724/1339182485824864287
             */
            const maximum = 4.82;

            /**
             * I'm not exactly sure what this value should be.
             *
             * From GitHub:
             * > This image shows that the battery disconnects when the voltage reaches 2.75 V
             * @see https://github.com/usetrmnl/firmware
             *
             * From Discord:
             * > You should see 3.2 - 4.2V usually
             * @see https://discord.com/channels/1281055965508141100/1284989157063790724/1339182485824864287
             */
            const minimum = 3.2;

            this.batteryPercentage = Math.floor(
                ((this.batteryVoltage - minimum) / (maximum - minimum)) * 100
            );

            if (this.batteryPercentage > 100) {
                console.warn(
                    `Warning: Battery voltage is ${this.batteryVoltage}V`
                );
            }
        } else {
            this.batteryPercentage = Math.floor(Math.random() * 100);
        }
    }

    static mock() {
        return new TrmnlRequest(
            new NextRequest(new URL(`https://www.example.com`), {
                headers: {
                    host: "www.example.com"
                }
            })
        );
    }
}
