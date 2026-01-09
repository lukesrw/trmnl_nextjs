"use client";

import { RenderContainerConfig } from "@/lib/SingleRender";
import { RenderInput as RenderInputConfig } from "@/types/Render/RenderInput";
import { cloneDeep, set } from "lodash";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { AreaHighlight } from "./components/AreaHighlight";
import { GapControl } from "./components/GapControl";
import { RenderControl } from "./components/RenderControl";
import { TrmnlLogo } from "./components/TrmnlLogo";
import { useDevice } from "./hooks/useDevice";
import { GapProvider, useGap } from "./hooks/useGap";
import { useRender } from "./lib/useRender";
import { MODES } from "./MODES";

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
        path: string;
        config: RenderInputConfig & { flex?: number };
        isParentColumn: boolean;
        width: number;
        height: number;
    }>;
}

function RenderInput(props: Readonly<RenderInput.Props>) {
    const { viewMode } = useDevice();
    const { config, setConfig } = useConfig();

    const $Screen = useRender(
        Math.floor(props.width),
        Math.floor(props.height),
        {
            input: props.config,
            dither: {
                method: "radial"
            }
        },
        MODES[viewMode].name
    );

    return (
        <div
            className="relative bg-white"
            style={{
                flex: props.config.flex
            }}
        >
            {props.path}

            {$Screen.data}

            <RenderControl
                isColumn={props.isParentColumn}
                flex={props.config.flex}
                setFlex={(flex) => {
                    setConfig((config) => {
                        const x = set(cloneDeep(config), props.path, {
                            ...props.config,
                            flex
                        });

                        return x;
                    });
                }}
            />

            {props.children}
        </div>
    );
}

namespace RenderContainer {
    export type Props = PropsWithChildren<{
        path: string;
        config: RenderContainerConfig & { flex?: number };
        isParentColumn: boolean;
        width: number;
        height: number;
    }>;
}

const GAP_CONTROLS_SIZE = 24;
const GAP_INCREMENT = 24;

function RenderContainer(props: Readonly<RenderContainer.Props>) {
    const [isColumn, setIsColumn] = useState(props.config.isColumn ?? false);
    const [isLocalGap, setIsLocalGap] = useState(false);
    const [localGap, setLocalGap] = useState(props.config.gap ?? 0);
    const [flex, setFlex] = useState(props.config.flex ?? 1);
    const [mode, setMode] = useState<AreaHighlight.Props["mode"]>();
    const { gap, setGap } = useGap();

    useEffect(() => {
        if (!isLocalGap) {
            setLocalGap(gap);
        }
    }, [gap, isLocalGap]);

    let widthPerFlex = props.width;
    let heightPerFlex = props.height;

    const totalFlex = props.config.children.reduce((count, config) => {
        return count + config.flex;
    }, 0);

    if (isColumn) {
        if (props.config.children.length > 1 && localGap > 0) {
            heightPerFlex -= localGap * props.config.children.length - 1;
        }
        heightPerFlex /= totalFlex;
    } else {
        if (props.config.children.length > 1 && localGap > 0) {
            widthPerFlex -= localGap * props.config.children.length - 1;
        }
        widthPerFlex /= totalFlex;
    }

    return (
        <div
            className="relative flex h-full transition-[gap]"
            style={{
                gap: localGap,
                flexDirection: isColumn ? "column" : "row",
                flex
            }}
        >
            {props.config.children.map((config, index) => {
                const isFirstChild = index === 0;
                const isLastChild = index === props.config.children.length - 1;

                const width = widthPerFlex * (isColumn ? config.flex : 1);
                const height = heightPerFlex * (isColumn ? 1 : config.flex);

                if ("children" in config) {
                    return (
                        <RenderContainer
                            path={`${props.path ? `${props.path}.` : ""}children[${index}]`}
                            key={index}
                            config={config}
                            isParentColumn={isColumn}
                            width={width}
                            height={height}
                        >
                            <GapControl
                                localGap={localGap}
                                setLocalGap={setLocalGap}
                                setGap={setGap}
                                setIsLocalGap={setIsLocalGap}
                                isColumn={isColumn}
                                setIsColumn={setIsColumn}
                                isFirstChild={isFirstChild}
                                isLastChild={isLastChild}
                                setMode={setMode}
                            />
                        </RenderContainer>
                    );
                }

                return (
                    <RenderInput
                        path={`${props.path ? `${props.path}.` : ""}children[${index}]`}
                        key={index}
                        config={config}
                        isParentColumn={isColumn}
                        width={width}
                        height={height}
                    >
                        <GapControl
                            localGap={localGap}
                            setLocalGap={setLocalGap}
                            setGap={setGap}
                            setIsLocalGap={setIsLocalGap}
                            isColumn={isColumn}
                            setIsColumn={setIsColumn}
                            isFirstChild={isFirstChild}
                            isLastChild={isLastChild}
                            setMode={setMode}
                        />
                    </RenderInput>
                );
            })}

            <AreaHighlight mode={mode}></AreaHighlight>

            {props.children}
        </div>
    );
}

function RenderParent() {
    const { config } = useConfig();
    const { device } = useDevice();

    return (
        <RenderContainer
            path=""
            config={config}
            isParentColumn={false}
            width={device.screen.width}
            height={device.screen.height}
        />
    );
}

type ConfigContextValue = {
    config: RenderContainerConfig;
    setConfig: Dispatch<SetStateAction<ConfigContextValue["config"]>>;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

function ConfigProvider(props: Readonly<PropsWithChildren>) {
    const [config, setConfig] = useState<ConfigContextValue["config"]>({
        children: [
            {
                type: "image",
                path: "kids-modified.png",
                flex: 1
            },
            {
                type: "image",
                path: "kids-modified.png",
                flex: 1
            }
        ],
        gap: GAP_CONTROLS_SIZE * 2,
        isColumn: false
    });

    return <ConfigContext.Provider value={{ config, setConfig }}>{props.children}</ConfigContext.Provider>;
}

export function useConfig() {
    const configContext = useContext(ConfigContext);
    if (!configContext) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }

    return configContext;
}

export function TrmnlDevice(props: Readonly<TrmlDevice.Props>) {
    const { device } = useDevice();

    return (
        <ConfigProvider>
            <GapProvider>
                <div className="group/trmnl mx-auto w-min" style={{ perspective: "1000px" }}>
                    <div className="relative flex" style={device.style.frame}>
                        <div className="relative flex-1 overflow-hidden bg-neutral-300" style={device.style.screen}>
                            <RenderParent />

                            <div
                                className="pointer-events-none absolute left-0 top-0 h-full w-full"
                                style={device.style.screenShadow}
                            ></div>
                        </div>
                        <div
                            className="absolute bottom-0 left-0 flex h-0 w-full items-center justify-center gap-2 font-microma font-bold leading-[0] tracking-widest text-black/50"
                            style={device.style.bottom}
                        >
                            <div className="relative aspect-square" style={device.style.bottomLogo}>
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
                        borderRadius: "0.5rem",
                        color: device.isLight ? "#000" : "#FFF",
                        fontSize: "0.75rem",
                        fontWeight: "700"
                    }}
                    className="font-microma"
                />
            </GapProvider>
        </ConfigProvider>
    );
}

export namespace TrmlDevice {
    export type Props = PropsWithChildren;
}
