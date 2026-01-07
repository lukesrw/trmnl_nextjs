import { TrmnlRequest } from "@/app/api/lib/TrmnlRequest";
import { RenderDither } from "@/types/Render/RenderDither";
import { RenderInput } from "@/types/Render/RenderInput";
import { RenderThreshold } from "@/types/Render/RenderThreshold";

type RenderConfig<TRenderInput extends object> = TRenderInput & {
    dither?: RenderDither;
    threshold?: RenderThreshold;
};

// export type SingleRenderConfig = RenderConfig<RenderInput>;

export type RenderContainerConfig = {
    children: Array<
        (RenderConfig<RenderInput> | RenderContainerConfig) & {
            flex: number;
        }
    >;
    gap?: number;
    isColumn?: boolean;
};

export class Render {
    constructor(
        private trmnlRequest: TrmnlRequest,
        private config: RenderConfig<RenderContainerConfig>,
        private debug?: {
            input?: boolean;
            dither?: boolean;
            threshold?: boolean;
            bmp?: boolean;
        }
    ) {}
}
