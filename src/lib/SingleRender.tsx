import { RenderDither } from "@/types/Render/RenderDither";
import { RenderInput } from "@/types/Render/RenderInput";
import { RenderThresholdOptions } from "@/types/Render/RenderThreshold";
import { CSSProperties } from "react";

export type SingleRenderConfig = RenderInput & {
    dither?: RenderDither;
    threshold?: RenderThresholdOptions;
};

type GridRenderConfig = {
    style: Pick<CSSProperties, "gap" | "flexDirection" | "flex">;
};

type MultiRenderConfig = {};
