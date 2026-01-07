"use client";

import { RenderContainerConfig } from "@/lib/SingleRender";
import { RenderInput as RenderInputConfig } from "@/types/Render/RenderInput";
import { PropsWithChildren, useState } from "react";
import { Tooltip } from "react-tooltip";
import { GapControl } from "./components/GapControl";
import { RenderControl } from "./components/RenderControl";
import { TrmnlLogo } from "./components/TrmnlLogo";
import { useDevice } from "./hooks/useDevice";

export namespace TrmlDevice {
    export type Props = PropsWithChildren;
}

/*
{$Screen.isLoading ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 w-1/2">
        <Image
            alt="TRMNL Logo"
            src="/img/trmnl.svg"
            fill
            className="opacity-10 animate-spin"
            style={{
                animationDuration: "5s"
            }}
        />
    </div>
) : (
    $Screen.data
)}
*/

namespace RenderInput {
    export type Props = PropsWithChildren<{
        config: RenderInputConfig & { flex?: number };
        isParentColumn: boolean;
    }>;
}

function RenderInput(props: Readonly<RenderInput.Props>) {
    return (
        <div
            className="bg-white relative"
            style={{
                flex: props.config.flex
            }}
        >
            {JSON.stringify(props.config, null, 4)}

            <RenderControl isColumn={props.isParentColumn} />

            {props.children}
        </div>
    );
}

namespace RenderContainer {
    export type Props = PropsWithChildren<{
        config: RenderContainerConfig & { flex?: number };
        isParentColumn: boolean;
    }>;
}

const GAP_CONTROLS_SIZE = 24;
const GAP_INCREMENT = 24;

function RenderContainer(props: Readonly<RenderContainer.Props>) {
    const [isColumn, setIsColumn] = useState(props.config.isColumn ?? false);
    const [gap, setGap] = useState(props.config.gap ?? 0);
    const [flex, setFlex] = useState(props.config.flex ?? 1);

    return (
        <div
            className="flex relative transition-[gap] h-full"
            style={{
                gap,
                flexDirection: isColumn ? "column" : "row",
                flex
            }}
        >
            {props.config.children.map((config, index) => {
                const isFirstChild = index === 0;
                const isLastChild = index === props.config.children.length - 1;

                if ("children" in config) {
                    return (
                        <RenderContainer
                            key={index}
                            config={config}
                            isParentColumn={isColumn}
                        >
                            <GapControl
                                gap={gap}
                                setGap={setGap}
                                isColumn={isColumn}
                                setIsColumn={setIsColumn}
                                isFirstChild={isFirstChild}
                                isLastChild={isLastChild}
                            />
                        </RenderContainer>
                    );
                }

                return (
                    <RenderInput
                        key={index}
                        config={config}
                        isParentColumn={isColumn}
                    >
                        <GapControl
                            gap={gap}
                            setGap={setGap}
                            isColumn={isColumn}
                            setIsColumn={setIsColumn}
                            isFirstChild={isFirstChild}
                            isLastChild={isLastChild}
                        />
                    </RenderInput>
                );
            })}

            {props.children}
        </div>
    );
}

export function TrmnlDevice(props: Readonly<TrmlDevice.Props>) {
    const { device, $Screen } = useDevice();
    const [config, setConfig] = useState<RenderContainerConfig>({
        children: [
            {
                type: "text",
                content: "Hello World 1",
                flex: 1
            },
            {
                type: "text",
                content: "Hello World 1",
                flex: 1
            },
            {
                type: "text",
                content: "Hello World 1",
                flex: 1
            }
        ],
        gap: GAP_CONTROLS_SIZE * 2,
        isColumn: false
    });

    return (
        <>
            <div
                className="w-min mx-auto group/trmnl"
                style={{ perspective: "1000px" }}
            >
                <div className="flex relative" style={device.style.frame}>
                    <div
                        className="bg-neutral-300 flex-1 overflow-hidden relative"
                        style={device.style.screen}
                    >
                        <RenderContainer
                            config={config}
                            isParentColumn={false}
                        />

                        <div
                            className="w-full h-full absolute top-0 left-0 pointer-events-none"
                            style={device.style.screenShadow}
                        ></div>
                    </div>
                    <div
                        className="absolute bottom-0 left-0 w-full text-black/50 font-bold tracking-widest font-microma h-0 leading-[0] flex justify-center items-center gap-2"
                        style={device.style.bottom}
                    >
                        <div
                            className="relative aspect-square"
                            style={device.style.bottomLogo}
                        >
                            <TrmnlLogo />
                        </div>
                        TRMNL
                    </div>
                </div>
            </div>

            <Tooltip
                anchorSelect=".tooltip"
                style={{
                    backgroundColor: device.color,
                    borderRadius: "0.5rem"
                }}
            />
        </>
    );
}
