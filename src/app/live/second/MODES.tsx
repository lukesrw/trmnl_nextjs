import { ditherMethod } from "@/lib/dithering";
import { objectKeys } from "@/utils/lib/objectKeys";
import { Input } from "./components/Input";
import { useDevice } from "./hooks/useDevice";

function Dither() {
    const { pipeline, setPipeline } = useDevice();
    let method = pipeline.dither?.method as string | Function;
    if (typeof method === "function") {
        method = method.name;
    }

    return (
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
    );
}

export const MODES = [
    {
        name: "Input",
        Component: Input
    },
    {
        name: "Frame",
        Component: function () {
            return <div>Frame</div>;
        }
    },
    {
        name: "Dither",
        Component: Dither
    },
    {
        name: "Threshold",
        Component: function () {
            return <div>Threshold</div>;
        }
    },
    {
        name: "Preview"
    }
] as const;
