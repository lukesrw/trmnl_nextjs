import { Dimensions } from "@/utils/types/Screen";
import sharp from "sharp";
import { RenderInput } from "./RenderInput";

/**
 * @see https://sharp.pixelplumbing.com/api-resize
 */
type RenderDitherOptions = {
    /**
     * Currently dither methods are just passed the dimensions, however this could change.
     * We could have a threshold value passed to the dither, radius, error, etc.
     *
     * @todo consider supporting the ability for different dither methods to have options.
     */
    method?: (buffer: Buffer<ArrayBufferLike>, dimensions: Dimensions) => void;
} & Pick<sharp.ResizeOptions, "fit" | "position" | "width" | "height">;

/**
 * @see https://sharp.pixelplumbing.com/api-operation#threshold
 * @see https://sharp.pixelplumbing.com/api-resize
 */
type RenderThresholdOptions = {
    value?: number;
} & Pick<sharp.ResizeOptions, "fit" | "position" | "width" | "height">;

type RenderBmpOptions = {
    /**
     * Desired DPI for the BMP.
     *
     * @default 72
     */
    dpi?: number;
};

export type RenderOptions<TRenderInput = RenderInput> = {
    input: TRenderInput;
    dither?: RenderDitherOptions;
    threshold?: RenderThresholdOptions;
    bmp?: RenderBmpOptions;
};
