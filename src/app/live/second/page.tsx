"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { getDevice } from "./getDevice";
import { DeviceProvider } from "./hooks/useDevice";
import { ModeButton } from "./ModeButton";
import { MODES } from "./MODES";
import { TrmnlDevice } from "./TrmnlDevice";

const queryClient = new QueryClient();

export default function Page() {
    const device = getDevice("og", "sage");
    const [viewMode, setViewMode] = useState(4);
    const [currentMode, setCurrentMode] = useState(4);
    const [$Tab, set$Tab] = useState<ReactNode>(null);

    return (
        <QueryClientProvider client={queryClient}>
            <DeviceProvider device={device} viewMode={viewMode}>
                <div className="grid place-content-center h-dvh">
                    <TrmnlDevice />
                </div>

                <div
                    style={device.style.mode}
                    className="flex-1 flex flex-col justify-end fixed bottom-4 w-[50dvw] left-1/2 -translate-x-1/2"
                >
                    {$Tab !== null && (
                        <div
                            className="z-50 relative p-2"
                            style={{
                                backgroundColor:
                                    device.style.frame.backgroundColor,
                                borderRadius: device.style.frame.borderRadius,
                                borderBottomLeftRadius:
                                    currentMode === 0
                                        ? "0"
                                        : device.style.frame.borderRadius
                            }}
                        >
                            <div
                                style={{
                                    borderRadius:
                                        device.style.frame.borderRadius
                                }}
                            >
                                {$Tab}
                            </div>
                        </div>
                    )}
                    <div className="flex gap-4 z-0">
                        {MODES.map((mode, index) => {
                            return (
                                <ModeButton
                                    key={mode.name}
                                    isViewEnabled={index >= currentMode}
                                    isActive={currentMode === index}
                                    isViewActive={viewMode === index}
                                    setIsActive={() => {
                                        setCurrentMode(index);
                                        if (viewMode < index) {
                                            setViewMode(index);
                                        }

                                        if ("Component" in mode) {
                                            set$Tab(
                                                <mode.Component></mode.Component>
                                            );
                                        } else {
                                            set$Tab(null);
                                        }
                                    }}
                                    setIsViewActive={() => {
                                        setViewMode(index);
                                    }}
                                    hasContent={index !== 4}
                                >
                                    {mode.name}
                                </ModeButton>
                            );
                        })}
                    </div>
                </div>
            </DeviceProvider>
        </QueryClientProvider>
    );
}
