import { tmpdir } from "os";
import { join } from "path";
import { TrmnlRequest } from "../../lib/TrmnlRequest";

export class ImageStorage {
    url: string;
    directory: string;
    path: string;

    static getDirectory(trmnlRequest: TrmnlRequest) {
        if (trmnlRequest.isServerless) {
            return join(tmpdir(), "trmnl");
        }

        return join(process.cwd(), "public", "img");
    }

    constructor(trmlRequest: TrmnlRequest, public fileName: string) {
        if (trmlRequest.isServerless) {
            this.url = `http://${trmlRequest.host}/api/display-tmp/?image=${fileName}`;
        } else {
            this.url = `http://${trmlRequest.host}/img/${fileName}`;
        }
        this.directory = ImageStorage.getDirectory(trmlRequest);
        this.path = join(this.directory, fileName);
    }
}
