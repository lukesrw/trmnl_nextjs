import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function ControlShadow(props: Readonly<ControlShadow.Props>) {
    return (
        <div
            className={twMerge(
                "shadow-black/50 shadow-sm flex rounded-lg overflow-hidden",
                props.isColumn ? "" : "flex-col"
            )}
        >
            {props.children}
        </div>
    );
}

export namespace ControlShadow {
    export type Props = PropsWithChildren<{
        isColumn: boolean;
    }>;
}
