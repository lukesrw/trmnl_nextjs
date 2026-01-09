import { CSSProperties, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function Control(props: Readonly<Control.Props>) {
    return (
        <div
            className={twMerge(
                "absolute z-40 flex items-center justify-center opacity-5 transition-[opacity,width,height] hover:opacity-100",
                props.className
            )}
            style={props.style}
        >
            {props.children}
        </div>
    );
}

export namespace Control {
    export type Props = PropsWithChildren<{
        className?: string;
        style?: CSSProperties;
    }>;
}
