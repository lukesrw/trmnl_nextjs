import { tmpdir } from "os";
import { join } from "path";
import { TrmnlRequest } from "../../lib/TrmnlRequest";

export class ImageStorage {
    url: string;
    directory: string;
    path: string;

    static getDirectory(isServerless: boolean) {
        if (isServerless) {
            return join(tmpdir(), "trmnl");
        }

        return join(process.cwd(), "public", "img");
    }

    constructor(
        { isServerless, nextRequest: { nextUrl, headers } }: TrmnlRequest,
        public fileName: string
    ) {
        this.url = `${nextUrl.protocol}//${headers.get("host")}/`;
        if (isServerless) {
            this.url += "api/display-tmp/?image=";
        } else {
            this.url += "img/";
        }
        this.url += fileName;

        this.directory = ImageStorage.getDirectory(isServerless);
        this.path = join(this.directory, fileName);
    }
}
