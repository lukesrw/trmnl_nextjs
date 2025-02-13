import { tmpdir } from "os";
import { join } from "path";
import { TrmnlRequest } from "../../lib/TrmnlRequest";

export class ImageStorage {
    url: string;
    directory: string;
    path: string;

    constructor(trmlRequest: TrmnlRequest, public fileName: string) {
        if (trmlRequest.isServerless) {
            this.url = `http://${trmlRequest.host}/api/display-tmp?image=${fileName}`;
            this.directory = join(tmpdir(), "trmnl");
        } else {
            this.url = `http://${trmlRequest.host}/img/${fileName}`;
            this.directory = join(process.cwd(), "public", "img");
        }
        this.path = join(this.directory, fileName);
    }
}
