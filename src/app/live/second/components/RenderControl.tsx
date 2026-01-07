import {
    faImage,
    faQuestion,
    faTableCellsLarge
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";
import { GapControlButton } from "./GapControlButton";

export function RenderControl(props: Readonly<RenderControl.Props>) {
    const position = [
        "left-1/2 -translate-x-1/2",
        props.isColumn ? "right-4" : "bottom-4"
    ];

    if (props.isColumn) {
        position[0] = "top-1/2 -translate-y-1/2";
    }
    if (props.isContainer) {
        position[1] = props.isColumn ? "right-4" : "top-4";
    }

    return (
        <div
            className={twMerge(
                "absolute opacity-20 hover:opacity-100 flex justify-center items-center",
                props.isColumn ? "h-full" : "w-full",
                position[0],
                position[1]
            )}
            style={{
                height: GapControlButton.SIZE
            }}
        >
            <div
                className={twMerge(
                    "flex shadow-black/50 shadow-sm",
                    props.isColumn ? "flex-col" : ""
                )}
            >
                <FontAwesomeIcon
                    icon={props.isContainer ? faTableCellsLarge : faImage}
                />
                <GapControlButton icon={faQuestion} onClick={() => {}} />

                {props.isColumn ? "column" : "row"}
                {props.isContainer ? "container" : "other"}
            </div>
        </div>
    );
}

export namespace RenderControl {
    export type Props = {
        isContainer?: boolean;
        isColumn: boolean;
    };
}
