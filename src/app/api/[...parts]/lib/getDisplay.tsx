import { ditherMethod } from "@/lib/dithering";
import { Render } from "@/lib/Render";
import { join } from "path";
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

    return join("work", `${item}.jpg`);
}

function getRandomSteveImage() {
    const item = Math.floor(Math.random() * 7) + 1;

    return join("steve", `${item}.jpg`);
}

function getRandomBPImage() {
    const item = Math.floor(Math.random() * 43) + 1;

    return join("bp", `${item}.png`);
}

export function getDisplay(trmnlRequest: TrmnlRequest, isDebug = false) {
    return new Render(
        trmnlRequest,
        {
            input: {
                type: "html",
                content: `<div style="display: flex; justify-content: center; align-items: center; font-size: 7rem; flex-direction: column; gap: 0.5rem;">
                    <span>Hi Naama! 👋🏻</span>
                    <span style="font-size: 0.2em; text-align: center; width: 80%;">( I'm very jealous of your English ability, I hope that one day my Hebrew is as good as your English is )</span>
                </div>`,
                isWhite: false
            },
            //             frame: {
            //                 component(props: PropsWithChildren) {
            //                     return (
            //                         <div tw="flex flex-col w-full h-full bg-white text-black">
            //                             {props.children}
            //
            //                             {(!trmnlRequest.isTrmnl ||
            //                                 trmnlRequest.batteryPercentage < 50) && (
            //                                 <div tw="absolute top-0 left-0 bg-white flex p-2 pl-4 rounded-br-xl shadow-md shadow-black/50">
            //                                     {trmnlRequest.batteryPercentage}%
            //                                 </div>
            //                             )}
            //
            //                             {!trmnlRequest.isServerless && (
            //                                 <div tw="absolute top-0 right-0 bg-white flex p-2 pl-4 rounded-bl-xl shadow-md shadow-black/50">
            //                                     {trmnlRequest.nextRequest.nextUrl.port}
            //                                 </div>
            //                             )}
            //
            //                             <div tw="w-full absolute bottom-0 left-0 flex justify-center">
            //                                 <div tw="w-1/2 bg-white flex justify-center py-2 pb-4 rounded-t-xl shadow-md shadow-black/50">
            //                                     {new Intl.DateTimeFormat("en-US", {
            //                                         dateStyle: "full",
            //                                         timeStyle: "short",
            //                                         timeZone: "Europe/London"
            //                                     }).format(Date.now())}
            //                                 </div>
            //                             </div>
            //                         </div>
            //                     );
            //                 },
            //                 fit: "cover",
            //                 position: "center"
            //             },
            dither: {
                // radial or lowPalette
                method: ditherMethod.basic,
                position: "center",
                fit: "cover"
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
