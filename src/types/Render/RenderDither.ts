import { ditherMethod } from "@/lib/dithering";
import { Dimensions } from "@/utils/types/Screen";
import sharp from "sharp";

/**
 * @see https://sharp.pixelplumbing.com/api-resize
 */
export type RenderDither = {
    /**
     * Currently dither methods are just passed the dimensions, however this could change.
     * We could have a threshold value passed to the dither, radius, error, etc.
     *
     * @todo consider supporting the ability for different dither methods to have options.
     */
    method?:
        | keyof typeof ditherMethod
        | ((buffer: Buffer<ArrayBufferLike>, dimensions: Dimensions) => void);
} & Pick<sharp.ResizeOptions, "fit" | "position" | "width" | "height">;
