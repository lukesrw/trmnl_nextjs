import { mkdir, unlink, writeFile } from "fs/promises";
import { after } from "next/server";
import { TrmnlRequest } from "../../lib/TrmnlRequest";
import { getDisplay } from "./getDisplay";
import { ImageStorage } from "./ImageStorage";
import { Trmnl } from "./Trmnl";

export async function display(trmnlRequest: TrmnlRequest) {
    const image = await getDisplay(trmnlRequest).toBmp();

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
