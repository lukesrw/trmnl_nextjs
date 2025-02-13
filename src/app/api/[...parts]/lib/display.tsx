import { ditherMethod } from "@/lib/dithering";
import { Render } from "@/lib/Render";
import { mkdir, unlink, writeFile } from "fs/promises";
import { after } from "next/server";
import { join } from "path";
import { TrmnlRequest } from "../../lib/TrmnlRequest";
import { ImageStorage } from "./ImageStorage";
import { Trmnl } from "./Trmnl";

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

export async function display(trmnlRequest: TrmnlRequest) {
    const image = await new Render({
        input: {
            type: "image",
            path: getRandomNeilImage()
        },
        dither: {
            method: ditherMethod.basic,
            position: "top"
        }
    }).toBmp();

    const location = new ImageStorage(
        trmnlRequest,
        `time-${new Date().getTime()}.bmp`
    );

    /**
     * Write the BMP to disk, add to list of `filePaths` to clean up.
     */
    await mkdir(location.directory, { recursive: true });
    await writeFile(location.path, image);

    /**
     * If you're not serverless, you can both serve and clean up after yourself.
     */
    if (!trmnlRequest.isServerless) {
        after(() => {
            setTimeout(async () => {
                await unlink(location.path);
            }, 3e3);
        });
    }

    return new Trmnl(trmnlRequest).display({
        // url: `data:image/bmp;base64,${Buffer.from(image.bmp).toString(
        //     "base64"
        // )}`,
        url: location.url,
        refreshRate: 300
    });
}
