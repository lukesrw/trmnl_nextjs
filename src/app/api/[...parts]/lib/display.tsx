import { mkdir, unlink, writeFile } from "fs/promises";
import { after } from "next/server";
import { TrmnlRequest } from "../../lib/TrmnlRequest";
import { getDisplay } from "./getDisplay";
import { ImageStorage } from "./ImageStorage";
import { Trmnl } from "./Trmnl";

export async function display(trmnlRequest: TrmnlRequest) {
    const image = getDisplay(trmnlRequest, true);

    /**
     * @todo enable support when (if?) firmware working.
     */
    const useBase64 = trmnlRequest.isBase64 && false;

    let filename = "";
    let url: string;
    if (useBase64) {
        url = await image.toString("base64");
    } else {
        const bmp = await image.toBmp();
        const location = new ImageStorage(
            trmnlRequest,
            `time-${new Date().getTime()}.bmp`
        );
        filename = location.fileName;
        url = location.url;

        /**
         * Write the BMP to disk, add to list of `filePaths` to clean up.
         */
        await mkdir(location.directory, { recursive: true });
        await writeFile(location.path, bmp);

        /**
         * If you're not serverless, you can both serve and clean up after yourself.
         */
        if (!trmnlRequest.isServerless) {
            after(() => {
                setTimeout(async () => {
                    await unlink(location.path);
                }, 5e3);
            });
        }
    }

    return new Trmnl(trmnlRequest).display({
        url,
        filename,
        refreshRate: 300
    });
}
