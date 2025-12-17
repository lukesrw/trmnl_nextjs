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

    return (
        <div className="flex-1 relative group basis-0 min-w-0">
            <button
                className={twMerge(
                    "p-2 px-20 font-microma text-xl rounded-xl w-full text-black font-medium group/button relative",
                    props.isActive
                        ? ""
                        : "[&:not(:hover)]:!bg-transparent [&:not(:hover)]:!shadow-none opacity-50"
                )}
                onClick={props.setIsActive}
                style={{
                    backgroundColor,
                    borderRadius,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                }}
            >
                {props.children}

                <div
                    className="left-0 h-full w-full absolute top-full pointer-events-none group-hover/button:opacity-100 opacity-0"
                    style={{
                        backgroundColor: device.style.frame.backgroundColor
                    }}
                ></div>
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
