import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { useDevice } from "../hooks/useDevice";

export function ControlShadow(props: Readonly<ControlShadow.Props>) {
    const { device } = useDevice();

    return (
        <div
            className={twMerge(
                "z-50 flex overflow-hidden rounded-lg shadow-sm shadow-black/20",
                props.isColumn ? "" : "flex-col",
                props.className
            )}
            style={{
                background: device.color
            }}
        >
            {props.children}
        </div>
    );
}

export namespace ControlShadow {
    export type Props = PropsWithChildren<{
        isColumn: boolean;
        className?: string;
    }>;
}
