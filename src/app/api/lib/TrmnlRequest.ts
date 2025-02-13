import { isServerlessRequest } from "@/utils/isServerlessRequest";
import { NextRequest } from "next/server";

export class TrmnlRequest {
    nextRequest!: NextRequest;

    /**
     * Derived from NextRequest.
     */
    host!: string;
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
         * Store the `NextRequest`, derive `isServerless`.
         */
        this.nextRequest = request;
        const host = this.nextRequest.headers.get("host");
        if (!host) {
            throw new Error("Missing `host` header");
        }
        this.host = host;
        this.isServerless = isServerlessRequest(request);

        /**
         * Derive TRMNL properties.
         */
        this.accessToken = this.nextRequest.headers.get("access-token");
        this.batteryVoltage = Number(
            this.nextRequest.headers.get("battery-voltage")
        );
        this.firmwareVersion = this.nextRequest.headers.get("fw-version");
        this.refreshRate = Number(this.nextRequest.headers.get("refresh-rate"));
        this.id = this.nextRequest.headers.get("id");
        this.rssi = Number(this.nextRequest.headers.get("rssi"));
        this.userAgent = this.nextRequest.headers.get("user-agent");

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

            console.log(`Battery voltage is ${this.batteryVoltage}V`);

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
