import { ditherMethod } from "@/lib/dithering";
import { RenderDither } from "@/types/Render/RenderDither";
import { objectKeys } from "@/utils/lib/objectKeys";
import { ArrayIndexes } from "@/utils/types/ArrayIndexes";
import { ChangeEvent, useCallback } from "react";
import { Input } from "./components/Input";
import { useDevice } from "./hooks/useDevice";

function Dither() {
    const { pipeline, setPipeline } = useDevice();
    let method = pipeline.dither?.method as string | Function;
    if (typeof method === "function") {
        method = method.name;
    }

    return (
        <div className="flex">
            <select
                value={method ?? "default"}
                onChange={(e) => {
                    const method = e.currentTarget
                        .value as keyof typeof ditherMethod;

                    setPipeline((pipeline) => {
                        return {
                            ...pipeline,
                            dither: {
                                ...pipeline.dither,
                                method
                            }
                        };
                    });
                }}
            >
                {objectKeys(ditherMethod).map((method) => {
                    return (
                        <option key={method} value={method}>
                            {method}
                        </option>
                    );
                })}
            </select>

            <Threshold />

            <select
                value={pipeline.dither?.fit}
                onChange={(e) => {
                    const fit = e.currentTarget.value as RenderDither["fit"];

                    setPipeline((pipeline) => {
                        return {
                            ...pipeline,
                            dither: {
                                ...pipeline.dither,
                                fit
                            }
                        };
                    });
                }}
            >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="inside">Inside</option>
                <option value="outside">Outside</option>
            </select>

            <select
                value={pipeline.dither?.position}
                onChange={(e) => {
                    const position = e.currentTarget
                        .value as RenderDither["position"];

                    setPipeline((pipeline) => {
                        return {
                            ...pipeline,
                            dither: {
                                ...pipeline.dither,
                                position
                            }
                        };
                    });
                }}
            >
                <option value="top">top</option>
                <option value="left top">top left</option>
                <option value="right top">top right</option>
                <option value="left">left</option>
                <option value="center">center</option>
                <option value="right">right</option>
                <option value="left bottom">bottom left</option>
                <option value="right bottom">bottom right</option>
                <option value="bottom">bottom</option>
            </select>
        </div>
    );
}

function Threshold() {
    const { pipeline, setPipeline } = useDevice();

    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.currentTarget.value);

            setPipeline((pipeline) => {
                return {
                    ...pipeline,
                    threshold: {
                        ...pipeline.threshold,
                        value
                    }
                };
            });
        },
        [setPipeline]
    );

    return (
        <label className="flex-col flex">
            Threshold
            <input
                type="range"
                className="block"
                min="0"
                max="255"
                value={pipeline.threshold?.value ?? 128}
                list="threshold-values"
                onChange={onChange}
            />
            <datalist id="threshold-values">
                <option value="0" />
                <option value="128" />
                <option value="255" />
            </datalist>
        </label>
    );
}

export const MODES = [
    {
        name: "Choose",
        Component: Input
    },
    {
        name: "Style",
        Component: Dither
    },
    {
        name: "Preview"
    }
] as const;

export type ModeIndex = ArrayIndexes.AsNumbers<typeof MODES>;
