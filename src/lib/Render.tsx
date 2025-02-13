import {
    RenderInputBuffer,
    RenderInputError,
    RenderInputJsx
} from "@/types/Render/RenderInput";
import { RenderOptions } from "@/types/Render/RenderOptions";
import { INCHES_PER_METER } from "@/utils/data/unit";
import { toLittleEndian } from "@/utils/toLittleEndian";
import { ImageResponseOptions } from "next/server";
import { CSSProperties } from "react";
import sharp, { Sharp } from "sharp";
import { screen } from "./data/TRMNL";

export class Render {
    /**
     * Cached stages of the render pipeline.
     */
    private _input: Buffer<ArrayBufferLike> | null = null;
    private _framed: Buffer<ArrayBufferLike> | null = null;
    private _dithered: Sharp | null = null;
    private _threshold: Sharp | null = null;
    private _bmp: Buffer<ArrayBufferLike> | null = null;

    /**
     * `hash` and `isWhiteCache` used for storing detected `isWhite` issues.
     */
    private hash: string | null;
    static isWhiteCache = new Map<string, boolean>();

    constructor(
        private config: RenderOptions,
        private debug?: {
            input?: boolean;
            frame?: boolean;
            dither?: boolean;
            threshold?: boolean;
            bmp?: boolean;
        }
    ) {
        this.hash = null;

        switch (this.config.input.type) {
            case "image":
                this.hash = this.config.input.path;
                break;

            case "jsx":
                this.hash = this.config.input.component.toString();
                break;

            case "text":
            case "html":
                this.hash = this.config.input.content;
                break;

            case "url":
                this.hash = this.config.input.url;
                break;
        }

        if (this.hash) {
            this.hash = this.hash.replace(/\W/g, "");

            if (Render.isWhiteCache.has(this.hash)) {
                this.config.input.isWhite = Render.isWhiteCache.get(this.hash);
            }
        }
    }

    private static async fromError(
        input: RenderInputError,
        isDebug = false
    ): Promise<Buffer<ArrayBufferLike>> {
        let message = "Oops, we couldn't render that!";
        if (input.cause instanceof Error) {
            message = input.cause.message;
        }

        if (isDebug) {
            console.table({
                Input: {
                    Type: "Error",
                    Error: message
                }
            });
        }

        return await this.fromJsx({
            type: "jsx",
            component() {
                return (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: 36,
                            padding: 64
                        }}
                        children={message}
                    />
                );
            }
        });
    }

    private static async fromJsx(
        input: RenderInputJsx,
        isDebug = false
    ): Promise<Buffer<ArrayBufferLike>> {
        const options: ImageResponseOptions = {
            width: input.width ?? screen.width,
            height: input.height ?? screen.height
        };

        const { ImageResponse } = await import("@vercel/og");

        try {
            /**
             * Prepare the JSX Component, wrapped in a frame if specified.
             */
            let $Component = <input.component></input.component>;
            if (input.frame) {
                $Component = <input.frame>{$Component}</input.frame>;
            }

            if (isDebug) {
                const debug: Record<string, unknown> = {
                    Input: {
                        Type: "JSX",
                        Name: input.component.name,
                        "Display Name": input.component.displayName,
                        Width: input.width,
                        Height: input.height,
                        "Is White": input.isWhite
                    }
                };
                if (input.frame) {
                    debug["Input Frame"] = {
                        Type: "JSX",
                        Name: input.frame?.name,
                        "Display Name": input.frame?.displayName
                    };
                }

                console.table(debug);
            }

            const buffer = await new ImageResponse(
                (
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            background: input.isWhite ? "#FFF" : "#000",
                            color: input.isWhite ? "#000" : "#FFF",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        {$Component}
                    </div>
                ),
                options
            )
                .arrayBuffer()
                .then((arrayBuffer) => Buffer.from(arrayBuffer));

            return Render.fromBuffer(
                {
                    type: "buffer",
                    data: buffer,
                    isWhite: input.isWhite
                },
                isDebug
            );
        } catch (error) {
            return Render.fromError(
                {
                    type: "error",
                    cause: error,
                    width: options.width,
                    height: options.height,
                    isWhite: input.isWhite
                },
                isDebug
            );
        }
    }

    private static getBufferSample(buffer: Buffer<ArrayBufferLike>) {
        return `${String.fromCharCode(buffer[0])}${String.fromCharCode(
            buffer[1]
        )}${String.fromCharCode(buffer[2])}${String.fromCharCode(
            buffer[3]
        )}`.replace(String.fromCharCode(0x89), "");
    }

    private static fromBuffer(
        input: RenderInputBuffer,
        isDebug = false
    ): Buffer<ArrayBufferLike> {
        if (isDebug) {
            console.table({
                Input: {
                    Type: "Buffer",
                    Sample: this.getBufferSample(input.data),
                    Length: input.data.length,
                    "Byte Length": input.data.byteLength,
                    "Is White": input.isWhite
                }
            });
        }

        return input.data;
    }

    /**
     * Convert the `input` config to a `Buffer` (pre-modifications).
     *
     * First step in the render pipeline and most accurate representation.
     */
    async toInput(useCache = true): Promise<Buffer<ArrayBufferLike>> {
        /**
         * If we've already retrieved the input, return it.
         */
        if (useCache && this._input !== null) {
            return this._input;
        }

        switch (this.config.input.type) {
            case "buffer":
                this._input = Render.fromBuffer(
                    this.config.input,
                    this.debug?.input
                );
                break;

            case "text":
                const { content: value } = this.config.input;
                const style: CSSProperties = this.config.input.style ?? {};
                style.color = style.color ?? "#000";
                style.fontSize = style.fontSize ?? 48;
                style.background = style.color === "#FFF" ? "#000" : "#FFF";

                if (this.config.input.isWhite === undefined) {
                    this.config.input.isWhite = style.background === "#FFF";
                }

                if (this.debug?.input) {
                    console.table({
                        Input: {
                            Type: "Text",
                            Value: value,
                            Style: JSON.stringify(style),
                            "Is White": this.config.input.isWhite
                        }
                    });
                }

                this._input = await Render.fromJsx(
                    {
                        type: "jsx",
                        component: () => {
                            return (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        ...style
                                    }}
                                    children={value}
                                />
                            );
                        },
                        isWhite: this.config.input.isWhite
                    },
                    this.debug?.input
                );
                break;

            case "jsx":
                this._input = await Render.fromJsx(
                    this.config.input,
                    this.debug?.input
                );
                break;

            case "image":
                if (this.debug?.input) {
                    console.table({
                        Input: {
                            Type: "Image",
                            Path: this.config.input.path,
                            "Is White": this.config.input.isWhite
                        }
                    });
                }

                const { readFile } = await import("fs/promises");

                try {
                    const buffer = await readFile(this.config.input.path);

                    this._input = Render.fromBuffer(
                        {
                            data: buffer,
                            type: "buffer",
                            isWhite: this.config.input.isWhite
                        },
                        this.debug?.input
                    );
                } catch (error) {
                    this._input = await Render.fromError(
                        {
                            type: "error",
                            cause: error,
                            isWhite: this.config.input.isWhite
                        },
                        this.debug?.input
                    );
                }
                break;

            case "url":
                if (this.debug?.input) {
                    console.table({
                        Input: {
                            Type: "URL",
                            URL: this.config.input.url,
                            Wait: this.config.input.wait,
                            Width: this.config.input.width,
                            Height: this.config.input.height,
                            "Is White": this.config.input.isWhite
                        }
                    });
                }

                const { chromium } = await import("playwright");

                const browser = await chromium.launch({ headless: true });
                const context = await browser.newContext({
                    viewport: {
                        width: this.config.input.width ?? screen.width,
                        height: this.config.input.height ?? screen.height
                    },
                    acceptDownloads: false,
                    colorScheme: this.config.input.isWhite ? "light" : "dark"
                });

                const page = await context.newPage();
                await page.goto(this.config.input.url);
                await page.waitForTimeout(this.config.input.wait ?? 1e3);
                const buffer = await page.screenshot();
                await browser.close();

                this._input = Render.fromBuffer(
                    {
                        type: "buffer",
                        data: buffer,
                        isWhite: this.config.input.isWhite
                    },
                    this.debug?.input
                );
                break;

            case "error":
                this._input = await Render.fromError(
                    this.config.input,
                    this.debug?.input
                );
                break;

            case "html":
                if (this.debug?.input) {
                    console.table({
                        Input: {
                            Type: "HTML",
                            Content: this.config.input.content.substring(
                                0,
                                this.config.input.content.indexOf("\n")
                            )
                        }
                    });
                }

                const { default: htmlReactParser } = await import(
                    "html-react-parser"
                );

                const html = this.config.input.content;

                this._input = await Render.fromJsx({
                    type: "jsx",
                    component() {
                        return htmlReactParser(html);
                    },
                    frame: this.config.input.frame,
                    height: this.config.input.height,
                    isWhite: this.config.input.isWhite,
                    width: this.config.input.width
                });
                break;
        }

        if (this.debug?.input) {
            console.groupEnd();
        }

        return this._input;
    }

    /**
     * Wrap the input `Buffer` in a frame if one has been specified.
     */
    private async getFramed(): Promise<Buffer<ArrayBufferLike>> {
        /**
         * If we've already framed the input, return it.
         */
        if (this._framed !== null) {
            return this._framed;
        }

        const input = await this.toInput();

        if (this.debug?.frame) {
            console.table({
                Frame: {
                    Type: this.config.input.type,
                    "Being Framed": Boolean(this.config.input.frame)
                }
            });
        }

        /**
         * If no frame has been specified, return the input.
         */
        if (!this.config.input.frame) {
            return input;
        }

        return Render.fromJsx({
            type: "jsx",
            component() {
                return (
                    <img
                        src={`data:image/png;base64,${input.toString(
                            "base64"
                        )}`}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                );
            },
            frame: this.config.input.frame
        });
    }

    /**
     * Convert the input `Buffer` to a flattened, resized, and optionally dithered `Buffer`.
     */
    private async getDithered(): Promise<Sharp> {
        /**
         * If we've already dithered the input, return it.
         */
        if (this._dithered !== null) {
            return this._dithered;
        }

        const width = this.config.dither?.width ?? screen.width;
        const height = this.config.dither?.height ?? screen.height;
        const background = this.config.input.isWhite ? "#FFF" : "#000";
        const input = await this.getFramed();

        if (this.debug?.dither) {
            console.table({
                Dither: {
                    Width: this.config.dither?.width,
                    Height: this.config.dither?.height,
                    Fit: this.config.dither?.fit,
                    Position: this.config.dither?.position,
                    Method: this.config.dither?.method?.name
                }
            });
        }

        this._dithered = await sharp(input)
            .flatten({
                background
            })
            .removeAlpha()
            .resize({
                width,
                height,
                background,
                fit: this.config.dither?.fit ?? "cover",
                position: this.config.dither?.position ?? "center"
            });

        if (this.config.dither?.method) {
            const ditheredBuffer = await this._dithered.raw().toBuffer();

            /**
             * Apply dithering to the image if a function was provided.
             */
            this.config.dither.method(ditheredBuffer, {
                width,
                height
            });

            this._dithered = await sharp(ditheredBuffer, {
                raw: {
                    width,
                    height,
                    channels: 3
                }
            });
        }

        return this._dithered;
    }

    /**
     * Second step in the render pipeline and shows results of the dithering.
     *
     * @todo ideally this would be a BMP for TRMNL previewing.
     */
    async toDithered(): Promise<Buffer<ArrayBufferLike>> {
        const dithered = await this.getDithered();

        return dithered.png().toBuffer();
    }

    /**
     * Convert the dithered `Buffer` to a thresholded `Buffer`.
     */
    async getThreshold(): Promise<Sharp> {
        /**
         * If we've already thresholded the input, return it.
         */
        if (this._threshold !== null) {
            return this._threshold;
        }

        const dithered = await this.getDithered();

        if (this.debug?.threshold) {
            console.table({
                Threshold: {
                    Width: this.config.threshold?.width,
                    Height: this.config.threshold?.height,
                    Fit: this.config.threshold?.fit,
                    Position: this.config.threshold?.position,
                    Value: this.config.threshold?.value
                }
            });
        }

        this._threshold = await dithered
            .resize({
                width: this.config.threshold?.width ?? screen.width,
                height: this.config.threshold?.height ?? screen.height,
                fit: this.config.threshold?.fit ?? "cover",
                position: this.config.threshold?.position ?? "center"
            })
            .threshold(this.config.threshold?.value)
            .toColorspace("b-w");

        return this._threshold;
    }

    /**
     * Third step in the render pipeline and shows results of the thresholding.
     *
     * @todo ideally this would be a BMP for TRMNL previewing.
     */
    async toThresholded(): Promise<Buffer<ArrayBufferLike>> {
        const thresholded = await this.getThreshold();

        return await thresholded.png().toBuffer();
    }

    /**
     * Convert the thresholded `Buffer` to the final `Buffer`.
     *
     * Final step in the render pipeline and shows the final image.
     */
    async toBmp(): Promise<Buffer<ArrayBufferLike>> {
        /**
         * If we've already converted the input to BMP, return it.
         */
        if (this._bmp !== null) {
            return this._bmp;
        }

        const thresholded = await this.getThreshold();

        /**
         * Sharp is being here exclusively to flip the image vertically.
         * I've tried to do it in the conversion below but it didn't work.
         *
         * @todo move the flip into the bit to byte conversion below
         */
        const sharpImageBits = await thresholded
            .resize({
                width: screen.width,
                height: screen.height
            })
            .flip(true)
            .raw()
            .toBuffer();

        const rowSize = Math.ceil(screen.width / 8);
        const rowBuffer = (4 - (rowSize % 4)) % 4;
        const pixelBufferSize = (rowSize + rowBuffer) * screen.height;
        const isForeground = this.config.input.isWhite ? 0 : 255;
        const pixelBuffer = Buffer.alloc(
            pixelBufferSize,
            this.config.input.isWhite ? 255 : 0
        );
        let modifiedPixels = 0;
        for (let y = 0; y < screen.height; y++) {
            const yIndex = y * screen.width;
            for (let x = 0; x < screen.width; x++) {
                const bitIndex = yIndex + x;
                const byteIndex = Math.floor(bitIndex / 8);

                if (sharpImageBits[bitIndex] === isForeground) {
                    const value = 1 << (7 - (bitIndex % 8));

                    modifiedPixels++;
                    if (this.config.input.isWhite) {
                        pixelBuffer[byteIndex] &= ~value;
                    } else {
                        pixelBuffer[byteIndex] |= value;
                    }
                }
            }
        }

        /**
         * Flag a warning if `this.config.input.isWhite` seems incorrect for the input.
         * In the future this could be logged and used if the same input is seen again.
         *
         * @todo store the warning, use to improve future renders
         */
        const resolution = screen.width * screen.height;
        if (modifiedPixels > resolution / 2) {
            if (this.hash) {
                Render.isWhiteCache.set(this.hash, !this.config.input.isWhite);
            }

            console.warn(
                `Modified ${Math.ceil(
                    (modifiedPixels / resolution) * 100
                )}% of the screen, consider changing \`isWhite\` to ${
                    this.config.input.isWhite ? "false" : "true"
                }`
            );
        }

        const bitmapHeaderSize = 62;
        const printResolution = Math.ceil(
            (this.config.bmp?.dpi ?? screen.dpi) * INCHES_PER_METER
        );
        const fileSize = bitmapHeaderSize + pixelBufferSize;

        if (this.debug?.bmp) {
            console.table({
                BMP: {
                    DPI: this.config.bmp?.dpi,
                    Width: screen.width,
                    Height: screen.height,
                    "File Size": fileSize,
                    "Modified Pixels": modifiedPixels,
                    "Modified %": Math.ceil((modifiedPixels / resolution) * 100)
                }
            });
        }

        // prettier-ignore
        const headerInfo = Buffer.from([
            // #region BMP Header
            /**
             * The signature "BM" (ASCII: 66, 77) to indicate it's a BMP file (2 bytes).
             */
            "B".charCodeAt(0), // 42
            "M".charCodeAt(0), // 4D

            /**
             * The total file size in little-endian byte order (4 bytes).
             */
            ...toLittleEndian(fileSize), // BE BB 00 00

            /**
             * Unused (4 bytes).
             */
            0, 0, 0, 0, // 00 00 00 00

            /**
             * The offset from the start of the file to the pixel data (4 bytes).
             */
            bitmapHeaderSize, 0, 0, 0, // 3E 00 00 00

            // #region DIB Header
            /**
             * Size of the info header (4 bytes, 40 bytes for V3).
             */
            40, 0, 0, 0, // 28 00 00 00

            /**
             * The width of the image in pixels (4 bytes).
             */
            ...toLittleEndian(screen.width), // 20 03 00 00

            /**
             * The height of the image in pixels (4 bytes).
             */
            ...toLittleEndian(screen.height), // E0 01 00 00

            /**
             * Color planes, must be set to 1 (2 bytes).
             */
            1, 0, // 01 00

            /**
             * The number of bits per pixel (e.g., 24 for RGB, 1 for monochrome) (2 bytes).
             */
            1, 0, // 01 00

            /**
             * Compression method (0 for no compression) (4 bytes).
             */
            0, 0, 0, 0, // 00 00 00 00

            /**
             * The size of the pixel data (can be 0 if uncompressed) (4 bytes).
             */
            ...toLittleEndian(pixelBufferSize), // 80 BB 00 00

            /**
             * Horizontal resolution in pixels per meter (not specified) (4 bytes).
             */
            ...toLittleEndian(printResolution), // 13 0B 00 00

            /**
             * Vertical resolution in pixels per meter (not specified) (4 bytes).
             */
            ...toLittleEndian(printResolution), // 13 0B 00 00

            /**
             * Number of colors in the color palette (0 for 24-bit, 2 for 1-bit) (4 bytes).
             */
            2, 0, 0, 0, // 02 00 00 00

            /**
             * Number of important colors (4 bytes).
             */
            2, 0, 0, 0, // 02 00 00 00,

            // #region Color Table
            /**
             * Color palette (4 bytes per color).
             */
            // Black
            0, 0, 0, 0, // 00 00 00 00
            // White
            255, 255, 255, 0 // FF FF FF 00
        ]);

        this._bmp = Buffer.concat([headerInfo, pixelBuffer]);

        return this._bmp;
    }

    async toString(encoding: BufferEncoding) {
        const bmp = await this.toBmp();

        return bmp.toString(encoding);
    }
}
