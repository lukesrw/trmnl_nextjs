"use server";

import { readdir, stat } from "fs/promises";
import { join } from "path";

const IMAGE_PATH = ["img"];
const IMAGE_SUFFIX = [".png", ".jpg", ".jpeg", ".bmp", ".gif"];

export async function getImages(path: string[]) {
    const publicPath = join(...IMAGE_PATH, ...path);
    const privatePath = join(process.cwd(), "public", publicPath);

    console.table({
        publicPath,
        privatePath
    });

    const files = await readdir(privatePath);

    const filesWithInfo = await Promise.all(
        files.map(async (file) => {
            const info = await stat(join(privatePath, file));

            let name = file;

            if (info.isDirectory()) {
                return {
                    type: "directory",
                    file,
                    name
                } as const;
            }

            const lastDot = file.lastIndexOf(".");
            name = file.substring(0, lastDot);

            const suffix = file.substring(lastDot);
            console.log(suffix);
            if (!IMAGE_SUFFIX.includes(suffix)) {
                return false;
            }
            console.log(`sending ${file}`);

            return {
                file,
                type: "image",
                name,
                path: join(publicPath, file).replace(/\\/g, "/")
            } as const;
        })
    );

    return filesWithInfo
        .filter((file) => typeof file === "object")
        .sort((file1, file2) => {
            if (file1.type === "directory" && file2.type !== "directory") {
                return -1;
            }
            if (file1.type !== "directory" && file2.type === "directory") {
                return 1;
            }
            return file1.name.localeCompare(file2.name);
        });
}
