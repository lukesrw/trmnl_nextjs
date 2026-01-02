import sharp from "sharp";

/**
 * @see https://sharp.pixelplumbing.com/api-operation#threshold
 * @see https://sharp.pixelplumbing.com/api-resize
 */
export type RenderThresholdOptions = {
    value?: number;
} & Pick<sharp.ResizeOptions, "fit" | "position" | "width" | "height">;
