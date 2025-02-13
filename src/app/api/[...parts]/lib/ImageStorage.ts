import { tmpdir } from "os";
import { join } from "path";
import { TrmnlRequest } from "../../lib/TrmnlRequest";

export class ImageStorage {
    url: string;
    path: string;

    constructor(trmlRequest: TrmnlRequest, public fileName: string) {
        if (trmlRequest.isServerless) {
            this.url = `http://${trmlRequest.host}/api/display-tmp?image=${fileName}`;
            this.path = join(tmpdir(), "trmnl", fileName);
        } else {
            this.url = `http://${trmlRequest.host}/img/${fileName}`;
            this.path = join(process.cwd(), "public", "img", fileName);
        }
    }
}
