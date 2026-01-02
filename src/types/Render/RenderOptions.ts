import { RenderBmp } from "./RenderBmp";
import { RenderDither } from "./RenderDither";
import { RenderFrame } from "./RenderFrame";
import { RenderInput } from "./RenderInput";
import { RenderThresholdOptions } from "./RenderThreshold";

export type RenderOptions<TRenderInput = RenderInput> = {
    input: TRenderInput;
    frame?: RenderFrame;
    dither?: RenderDither;
    threshold?: RenderThresholdOptions;
    bmp?: RenderBmp;
};
