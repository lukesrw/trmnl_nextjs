import { ditherMethod } from "@/lib/dithering";
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
