"use client";

import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { useDevice } from "./hooks/useDevice";
import { ModeIndex } from "./MODES";

export namespace ModeButton {
    export type Props = PropsWithChildren<{
        index: ModeIndex;
        isActive: boolean;
        isViewEnabled: boolean;
        // isViewActive: boolean;
        setIsActive: () => void;
        // setIsViewActive: () => void;
        hasContent?: boolean;
    }>;
}

export function ModeButton(props: Readonly<ModeButton.Props>) {
    const { device, viewMode, setViewMode } = useDevice();
    const { backgroundColor, borderRadius } = device.style.frame;
    const isViewModeActive = viewMode === props.index;

    return (
        <div className="group relative min-w-0 flex-1 basis-0">
            <button
                className={twMerge(
                    "group/button relative w-full rounded-xl p-2 px-20 font-microma text-xl font-medium text-black",
                    props.isActive ? "" : "opacity-50 [&:not(:hover)]:!bg-transparent [&:not(:hover)]:!shadow-none"
                )}
                onClick={() => {
                    props.setIsActive();

                    if (viewMode < props.index) {
                        setViewMode(props.index);
                    }
                }}
                style={{
                    backgroundColor,
                    borderRadius,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                }}
            >
                {props.children}

                <div
                    className="pointer-events-none absolute left-0 top-full h-full w-full opacity-0 group-hover/button:opacity-100"
                    style={{
                        backgroundColor: device.style.frame.backgroundColor
                    }}
                ></div>
            </button>

            <button
                className={twMerge(
                    "absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full",
                    isViewModeActive ? "bg-white" : "text-black/50 hover:bg-white/50",
                    props.isViewEnabled ? "" : "pointer-events-none opacity-0 group-hover:opacity-100"
                )}
                onClick={() => setViewMode(props.index)}
                style={{
                    boxShadow: isViewModeActive ? device.style.screenShadow.boxShadow : "none"
                }}
            >
                <FontAwesomeIcon icon={faEye} fixedWidth />
            </button>
        </div>
    );
}
