"use client";

import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getDevice } from "./getDevice";
import { DeviceProvider } from "./hooks/useDevice";
import { ModeButton } from "./ModeButton";
import { ModeIndex, MODES } from "./MODES";
import { TrmnlDevice } from "./TrmnlDevice";

const queryClient = new QueryClient();

export default function Page() {
    const device = getDevice("og", "sage");
    // const [viewMode, setViewMode] = useState<ModeIndex>(2);
    const [currentMode, setCurrentMode] = useState<ModeIndex>(2);
    const [$Tab, set$Tab] = useState<ReactNode>(null);

    return (
        <QueryClientProvider client={queryClient}>
            <DeviceProvider device={device}>
                <div className="flex h-dvh flex-col justify-between gap-16 overflow-y-hidden">
                    <div></div>

                    <TrmnlDevice />

                    <div className="mx-auto flex items-end gap-4">
                        <button
                            className={twMerge(
                                "flex w-[44px] flex-col p-2 pt-4 opacity-50",
                                currentMode === 0 ? "h-full" : "[&:not(:hover)]:!bg-transparent"
                            )}
                            style={{
                                backgroundColor: device.style.frame.backgroundColor,
                                borderRadius: device.style.frame.borderRadius,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0
                            }}
                        >
                            <FontAwesomeIcon icon={faFileImport} />
                            {currentMode === 0 && (
                                <div className="flex-1 font-microma text-xl [writing-mode:vertical-lr]">Load</div>
                            )}
                        </button>
                        <div style={device.style.mode} className="flex w-fit flex-col justify-end">
                            <div className="z-0 flex">
                                {MODES.map((mode, index) => {
                                    const modeIndex = index as ModeIndex;

                                    return (
                                        <ModeButton
                                            key={mode.name}
                                            index={modeIndex}
                                            isViewEnabled={index >= currentMode}
                                            isActive={currentMode === index}
                                            // isViewActive={viewMode === index}
                                            setIsActive={() => {
                                                setCurrentMode(modeIndex);

                                                if ("Component" in mode) {
                                                    set$Tab(<mode.Component></mode.Component>);
                                                } else {
                                                    set$Tab(null);
                                                }
                                            }}
                                            // setIsViewActive={() => {
                                            //     setViewMode(modeIndex);
                                            // }}
                                            hasContent={index !== 4}
                                        >
                                            {mode.name}
                                        </ModeButton>
                                    );
                                })}
                            </div>
                            {$Tab !== null && (
                                <div
                                    className="relative z-50 p-2 pb-0"
                                    style={{
                                        backgroundColor: device.style.frame.backgroundColor,
                                        borderTopLeftRadius: currentMode > 0 ? device.style.frame.borderRadius : 0,
                                        borderTopRightRadius: device.style.frame.borderRadius
                                    }}
                                >
                                    {$Tab}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DeviceProvider>
        </QueryClientProvider>
    );
}
