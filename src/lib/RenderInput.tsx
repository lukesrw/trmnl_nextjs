import {
    RenderInput,
    RenderInputBuffer,
    RenderInputError,
    RenderInputHTML,
    RenderInputImage,
    RenderInputJsx,
    RenderInputText,
    RenderInputWebsite
} from "@/types/Render/RenderInput";
import { join } from "path";
import { CSSProperties } from "react";

const jsx = (config: RenderInputJsx) => {
    return async (width: number, height: number) => {
        const { ImageResponse } = await import("@vercel/og");

        return await new ImageResponse(
            (
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        height: "100%",
                        background: config.isWhite ? "#FFF" : "#000",
                        color: config.isWhite ? "#000" : "#FFF",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <config.component />
                </div>
            ),
            {
                width,
                height
            }
        )
            .arrayBuffer()
            .then(Buffer.from);
    };
};

export const INPUTS = {
    buffer(config: RenderInputBuffer) {
        return () => {
            return config.data;
        };
    },
    jsx,
    text(config: RenderInputText) {
        const style: CSSProperties = config.style ?? {};
        style.color = style.color ?? "#000";
        style.fontSize = style.fontSize ?? 48;
        style.background = style.color === "#FFF" ? "#000" : "#FFF";

        return jsx({
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
                        children={config.content}
                    />
                );
            },
            type: "jsx",
            isWhite: config.isWhite ?? style.background === "#FFF"
        });
    },
    error(config: RenderInputError) {
        let message = "Oops, we couldn't render that!";
        if (config.cause instanceof Error) {
            message = config.cause.message;
        }

        return jsx({
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
                            fontSize: 34,
                            padding: 64
                        }}
                        children={message}
                    />
                );
            }
        });
    },
    html(config: RenderInputHTML) {
        return async (width, height) => {
            const { default: htmlReactParser } = await import(
                "html-react-parser"
            );

            return await jsx({
                type: "jsx",
                component() {
                    return htmlReactParser(config.content);
                },
                height: config.height,
                isWhite: config.isWhite,
                width: config.width
            })(width, height);
        };
    },
    image(config: RenderInputImage) {
        if (config.path.length === 0) {
            throw new Error("Choose an image");
        }

        return async () => {
            const { readFile } = await import("fs/promises");

            return await readFile(
                join(process.cwd(), "public", "img", config.path)
            );
        };
    },
    url(config: RenderInputWebsite) {
        return async (width, height) => {
            const { chromium } = await import("playwright");

            const browser = await chromium.launch({ headless: true });
            const context = await browser.newContext({
                viewport: {
                    width,
                    height
                },
                acceptDownloads: false,
                colorScheme: config.isWhite ? "light" : "dark"
            });

            const page = await context.newPage();
            await page.goto(config.url);
            await page.waitForTimeout(config.wait ?? 1e3);
            const buffer = await page.screenshot();
            await browser.close();

            return buffer;
        };
    }
} as const satisfies Record<
    RenderInput["type"],
    (
        config: any
    ) => (
        width: number,
        height: number
    ) => Buffer<ArrayBufferLike> | Promise<Buffer<ArrayBufferLike>>
>;
