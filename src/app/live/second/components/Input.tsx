import { RenderOptions } from "@/types/Render/RenderOptions";
import { objectKeys } from "@/utils/lib/objectKeys";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useDevice } from "../hooks/useDevice";
import { TextArea } from "./TextArea";

function InputHTML() {
    const { pipeline, setPipeline } = useDevice();
    if (pipeline.input.type !== "html") {
        return;
    }

    return (
        <TextArea
            label="HTML Content"
            value={pipeline.input.content}
            style={{
                borderBottomRightRadius: "0"
            }}
            setValue={(value) => {
                setPipeline((pipeline) => {
                    return {
                        ...pipeline,
                        input: {
                            ...pipeline.input,
                            content: value
                        }
                    };
                });
            }}
        ></TextArea>
    );
}

const INPUT_TYPES = {
    html: {
        name: "HTML",
        default: {
            content: `<div><h2>Hello World</h2>
                <p>Welcome to my TED Talk!</p></div>`
        },
        Component: InputHTML
    },
    image: {
        name: "Image",
        default: {
            path: ""
        },
        Component: function () {
            return <div>Image</div>;
        }
    },
    jsx: {
        name: "JSX",
        default: {
            component() {
                return <div></div>;
            }
        },
        Component: function () {
            return <div>JSX</div>;
        }
    },
    text: {
        name: "Text",
        default: {
            content: "Hello World",
            style: {
                color: "#000"
            }
        },
        Component: function () {
            return <div>Text</div>;
        }
    },
    url: {
        name: "Website",
        default: {
            url: "https://usetrmnl.com/",
            wait: 1e3
        },
        Component: function () {
            const { pipeline, setPipeline } = useDevice();
            if (pipeline.input.type !== "url") {
                return;
            }

            return (
                <div className="flex gap-4">
                    <input
                        className="p-2 px-4"
                        value={pipeline.input.url}
                        onChange={(e) => {
                            const url = e.currentTarget.value;

                            setPipeline((pipeline) => {
                                return {
                                    ...pipeline,
                                    input: {
                                        ...pipeline.input,
                                        url
                                    }
                                };
                            });
                        }}
                    ></input>
                </div>
            );
        }
    }
} satisfies Record<
    Exclude<RenderOptions["input"]["type"], "buffer" | "error">,
    {
        name: string;
        default: unknown;
        Component: FunctionComponent;
    }
>;

export function Input() {
    const { device, pipeline, setPipeline } = useDevice();
    const [$Controls, set$Controls] = useState<ReactNode>(null);

    useEffect(() => {
        const Component =
            INPUT_TYPES[pipeline.input.type as keyof typeof INPUT_TYPES]
                .Component;

        set$Controls(<Component></Component>);
    }, [pipeline.input.type]);

    return (
        <div className="flex flex-col">
            <div className="flex gap-4">
                {objectKeys(INPUT_TYPES).map((type) => {
                    const isActive = pipeline.input.type === type;
                    let borderBottomLeftRadius =
                        device.style.frame.borderRadius;
                    let borderBottomRightRadius =
                        device.style.frame.borderRadius;
                    if (isActive) {
                        borderBottomLeftRadius = "0";
                        borderBottomRightRadius = "0";
                    }

                    return (
                        <button
                            key={type}
                            className={twMerge(
                                "flex-1 p-2 px-4 font-microma text-xl bg-white font-medium",
                                isActive
                                    ? ""
                                    : "[&:not(:hover)]:!bg-transparent opacity-50 hover:opacity-50"
                            )}
                            style={{
                                borderRadius: device.style.frame.borderRadius,
                                borderBottomLeftRadius,
                                borderBottomRightRadius
                            }}
                            onClick={() => {
                                setPipeline((pipeline) => {
                                    return {
                                        ...pipeline,
                                        input: {
                                            ...INPUT_TYPES[
                                                type as keyof typeof INPUT_TYPES
                                            ].default,
                                            ...pipeline.input,
                                            type
                                        } as RenderOptions["input"]
                                    };
                                });
                            }}
                        >
                            {INPUT_TYPES[type].name}
                        </button>
                    );
                })}
            </div>

            <div
                className="flex-1 bg-white overflow-hidden p-4"
                style={{
                    borderRadius: device.style.frame.borderRadius,
                    borderTopLeftRadius:
                        pipeline.input.type === Object.keys(INPUT_TYPES)[0]
                            ? "0"
                            : device.style.frame.borderRadius,
                    borderTopRightRadius:
                        pipeline.input.type ===
                        Object.keys(INPUT_TYPES).slice(-1)[0]
                            ? "0"
                            : device.style.frame.borderRadius
                }}
            >
                {$Controls}
            </div>
        </div>
    );
}
