import { getImages } from "@/app/server/getImages";
import { RenderOptions } from "@/types/Render/RenderOptions";
import { objectKeys } from "@/utils/lib/objectKeys";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
    FunctionComponent,
    PropsWithChildren,
    ReactNode,
    useEffect,
    useState
} from "react";
import { twMerge } from "tailwind-merge";
import { useDevice } from "../hooks/useDevice";
import { InputHTML } from "./InputHTML";

export namespace FolderButton {
    export type Props = PropsWithChildren<{
        setPath(): void;
    }>;
}

function FolderButton(props: Readonly<FolderButton.Props>) {
    const { device } = useDevice();

    return (
        <button
            className="bg-yellow-400 aspect-[1.5]"
            onClick={props.setPath}
            style={{
                borderRadius: device.style.frame.borderRadius
            }}
        >
            {props.children}
        </button>
    );
}

function InputImage() {
    const { device, pipeline, setPipeline } = useDevice();
    if (pipeline.input.type !== "image") {
        return;
    }

    const [path, setPath] = useState<string[]>([]);

    const { isLoading, data } = useQuery({
        queryKey: ["getImages", path],
        async queryFn() {
            const files = await getImages(path);

            return files;
        }
    });

    return (
        <div
            className="grid grid-cols-4 grid-flow-row overflow-y-auto max-h-[300px] gap-4"
            style={{
                borderRadius: device.style.frame.borderRadius
            }}
        >
            {path.length > 0 && (
                <FolderButton
                    setPath={() => {
                        setPath((path) => path.slice(0, path.length - 1));
                    }}
                >
                    ..
                </FolderButton>
            )}
            {data?.map((file) => {
                switch (file.type) {
                    case "directory":
                        return (
                            <FolderButton
                                key={file.file}
                                setPath={() => {
                                    setPath((path) => {
                                        return [...path, file.name];
                                    });
                                }}
                            >
                                {file.name}
                            </FolderButton>
                        );
                }

                return (
                    <button
                        key={file.file}
                        className="relative aspect-[1.5] overflow-hidden"
                        style={{
                            borderRadius: device.style.frame.borderRadius
                        }}
                        onClick={() => {
                            setPipeline((pipeline) => {
                                return {
                                    ...pipeline,
                                    input: {
                                        ...pipeline.input,
                                        path: [...path, file.file].join("/")
                                    }
                                };
                            });
                        }}
                    >
                        <Image
                            src={`/${file.path}`}
                            alt={file.name}
                            fill
                            className="object-cover object-center"
                        />
                    </button>
                );
            })}
        </div>
    );
}

const INPUT_TYPES = {
    html: {
        name: "HTML",
        default: {
            content: `<div>
                    <h2>Hello World</h2>
                    <p>Welcome to my TED Talk!</p>
                </div>`
        },
        Component: InputHTML
    },
    image: {
        name: "Image",
        default: {
            path: ""
        },
        Component: InputImage
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
            <div className="flex">
                {objectKeys(INPUT_TYPES).map((type) => {
                    const isActive = pipeline.input.type === type;

                    return (
                        <button
                            key={type}
                            className={twMerge(
                                "flex-1 p-2 px-4 font-microma text-xl bg-white font-medium relative group/type",
                                isActive
                                    ? ""
                                    : "[&:not(:hover)]:!bg-transparent opacity-50 hover:opacity-50"
                            )}
                            style={{
                                borderRadius: device.style.frame.borderRadius,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0
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

                            <div className="bg-white opacity-0 group-hover/type:opacity-100 absolute left-0 top-full h-full w-full pointer-events-none"></div>
                        </button>
                    );
                })}
            </div>

            <div
                className="flex-1 bg-white overflow-hidden p-4 z-50"
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
                            : device.style.frame.borderRadius,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                }}
            >
                {$Controls}
            </div>
        </div>
    );
}
