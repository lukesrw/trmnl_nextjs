"use server";

import { MODES } from "@/app/live/second/MODES";
import { Render } from "@/lib/Render";
import { RenderOptions } from "@/types/Render/RenderOptions";
import { TrmnlRequest } from "../lib/TrmnlRequest";

export async function getScreen(
    config: RenderOptions,
    mode: (typeof MODES)[number]["name"]
) {
    const render = new Render(TrmnlRequest.mock(), config);

    switch (mode) {
        case "Choose":
            return await render.toInput();

        case "Style":
            return await render.toThresholded();

        default:
            return await render.toBmp();
    }
}
