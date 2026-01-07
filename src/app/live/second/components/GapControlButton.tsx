import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { useDevice } from "../hooks/useDevice";

export function GapControlButton(props: Readonly<GapControlButton.Props>) {
    const { device } = useDevice();

    return (
        <button
            className={twMerge(
                "transition-colors p-[0_5.75px] flex-1 opacity-50 hover:opacity-100 outline-none focus:opacity-100",
                props.tooltip ? "tooltip" : ""
            )}
            data-tooltip-content={props.tooltip?.content}
            data-tooltip-place={props.tooltip?.place}
            style={{
                background: device.color
            }}
            onClick={(event) => {
                props.onClick(event);
                event.currentTarget.blur();
            }}
        >
            <FontAwesomeIcon
                icon={props.icon}
                size="2xs"
                fixedWidth
                color="#FFF"
            />
        </button>
    );
}

export namespace GapControlButton {
    export type Props = {
        icon: IconProp;
        onClick: MouseEventHandler<HTMLButtonElement>;
        tooltip?: {
            content: string;
            place: "left" | "right" | "top" | "bottom";
        };
    };

    export const SIZE = 24;
}
