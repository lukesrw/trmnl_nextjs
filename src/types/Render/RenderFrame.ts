import { FunctionComponent, PropsWithChildren } from "react";
import sharp from "sharp";

export type RenderFrame = {
    component: FunctionComponent<PropsWithChildren>;
} & Pick<sharp.ResizeOptions, "fit" | "position" | "width" | "height">;
