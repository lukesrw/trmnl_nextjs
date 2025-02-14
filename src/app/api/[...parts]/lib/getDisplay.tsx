import { ditherMethod } from "@/lib/dithering";
import { Render } from "@/lib/Render";
import { join } from "path";
import { PropsWithChildren } from "react";
import { TrmnlRequest } from "../../lib/TrmnlRequest";

function getRandom12MonkeysImage() {
    const season = Math.floor(Math.random() * 4) + 1;
    const episode = Math.floor(Math.random() * 10) + 1;
    const recap = Math.floor(Math.random() * 14) + 1;

    return join(
        "E:",
        "12 Monkeys",
        "project-spearhead",
        "assets",
        "cdn",
        `Season ${season}`,
        `Episode ${episode}`,
        "Recaps",
        `${recap}.webp`
    );
}

let neilBag: number[] = [];

function getRandomNeilImage() {
    const item = Math.floor(Math.random() * 10) + 1;

    return join(process.cwd(), "public", "img", "work", `${item}.jpg`);
}

export function getDisplay(trmnlRequest: TrmnlRequest, isDebug = false) {
    console.log(trmnlRequest.nextRequest.nextUrl);

    return new Render(
        {
            input: {
                type: "image",
                path: getRandomNeilImage()
            },
            frame: {
                component(props: PropsWithChildren) {
                    return (
                        <div tw="flex flex-col w-full h-full bg-white text-black">
                            {props.children}

                            {(!trmnlRequest.isTrmnl ||
                                trmnlRequest.batteryPercentage < 50) && (
                                <div tw="absolute top-0 left-0 bg-white flex p-2 pl-4 rounded-br-xl shadow-md shadow-black/50">
                                    {trmnlRequest.batteryPercentage}%
                                </div>
                            )}

                            {!trmnlRequest.isServerless && (
                                <div tw="absolute top-0 right-0 bg-white flex p-2 pl-4 rounded-bl-xl shadow-md shadow-black/50">
                                    {trmnlRequest.nextRequest.nextUrl.port}
                                </div>
                            )}

                            <div tw="w-full absolute bottom-0 left-0 flex justify-center">
                                <div tw="w-1/2 bg-white flex justify-center py-2 pb-4 rounded-t-xl shadow-md shadow-black/50">
                                    {new Intl.DateTimeFormat("en-US", {
                                        dateStyle: "full",
                                        timeStyle: "short",
                                        timeZone: "Europe/London"
                                    }).format(Date.now())}
                                </div>
                            </div>
                        </div>
                    );
                },
                fit: "cover",
                position: "center"
            }
        },
        {
            bmp: isDebug,
            dither: isDebug,
            frame: isDebug,
            input: isDebug,
            threshold: isDebug
        }
    );
}
