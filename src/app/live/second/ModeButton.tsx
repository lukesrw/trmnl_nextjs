"use client";

import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { useDevice } from "./hooks/useDevice";

export namespace ModeButton {
    export type Props = PropsWithChildren<{
        isActive: boolean;
        isViewEnabled: boolean;
        isViewActive: boolean;
        setIsActive: () => void;
        setIsViewActive: () => void;
        hasContent?: boolean;
    }>;
}

export function ModeButton(props: Readonly<ModeButton.Props>) {
    const { device } = useDevice();
    const { backgroundColor, borderRadius } = device.style.frame;
    let borderTopLeftRadius = borderRadius;
    let borderTopRightRadius = borderRadius;
    if (props.isActive && props.hasContent) {
        borderTopLeftRadius = "0";
        borderTopRightRadius = "0";
    }

    return (
        <div className="flex-1 relative group">
            <button
                className={twMerge(
                    "p-2 font-microma text-xl rounded-xl w-full text-black font-medium",
                    props.isActive
                        ? ""
                        : "[&:not(:hover)]:!bg-transparent [&:not(:hover)]:!shadow-none opacity-50"
                )}
                onClick={props.setIsActive}
                style={{
                    backgroundColor,
                    borderRadius,
                    borderTopLeftRadius,
                    borderTopRightRadius
                }}
            >
                {props.children}
            </button>

            <button
                className={twMerge(
                    "absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8",
                    props.isViewActive
                        ? "bg-white"
                        : "text-black/50 hover:bg-white/50",
                    props.isViewEnabled
                        ? ""
                        : "pointer-events-none opacity-0 group-hover:opacity-100"
                )}
                onClick={props.setIsViewActive}
                style={{
                    boxShadow: props.isViewActive
                        ? device.style.screenShadow.boxShadow
                        : "none"
                }}
            >
                <FontAwesomeIcon icon={faEye} fixedWidth />
            </button>
        </div>
    );
}
