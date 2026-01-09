import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { useDevice } from "../hooks/useDevice";

export function ControlButton(props: Readonly<ControlButton.Props>) {
    const { device } = useDevice();

    return (
        <button
            className={twMerge(
                "flex-1 p-[0_5.75px] outline-none transition-colors",
                props.tooltip ? "tooltip" : "",
                device.isLight ? "hover:bg-black/20 focus:bg-black/20" : "hover:bg-white/20 focus:bg-white/20"
            )}
            data-tooltip-content={props.tooltip?.content}
            data-tooltip-place={props.tooltip?.place}
            onClick={(event) => {
                props.onClick(event);
                event.currentTarget.blur();
            }}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            disabled={props.isDisabled}
        >
            <FontAwesomeIcon
                icon={props.icon}
                size="2xs"
                fixedWidth
                className={device.isLight ? "text-black" : "text-white"}
            />
        </button>
    );
}

export namespace ControlButton {
    export type Props = {
        icon: IconProp;
        isDisabled?: boolean;
        onClick: MouseEventHandler<HTMLButtonElement>;
        onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
        onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
        tooltip?: {
            content: string;
            place: "left" | "right" | "top" | "bottom";
        };
    };

    export const SIZE = 24;
}
