import {
    faImage,
    faMinus,
    faPlus,
    faRotateLeft,
    faRotateRight,
    faTableCellsLarge,
    faTableColumns,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { TOOLTIP } from "../data/TOOLTIP";
import { ControlShadow } from "./ControlShadow";
import { GapControlButton } from "./GapControlButton";

export function GapControl(props: Readonly<GapControl.Props>) {
    /**
     * Ensure the controls are visible even if the gap is smaller than the controls
     */
    const size = Math.max(props.gap, GapControlButton.SIZE);

    /**
     * Adjust the position of the gap controls
     */
    const firstTransform: [string, string] = ["0", "0"];
    const secondTransform: [string, string] = ["0", "0"];
    if (props.isLastChild) {
        secondTransform[props.isColumn ? 1 : 0] = `${-size}px`;
    } else if (props.gap === 0) {
        secondTransform[props.isColumn ? 1 : 0] = `${
            GapControlButton.SIZE * -0.5
        }px`;
    }

    return (
        <>
            {props.isFirstChild && (
                <div
                    className={twMerge(
                        "absolute flex overflow-hidden z-50 opacity-20 hover:opacity-100 transition-[opacity,width,height] items-center justify-center",
                        props.isColumn
                            ? "left-0 w-full top-0"
                            : "top-0 h-full left-0"
                    )}
                    style={{
                        width: props.isColumn ? undefined : size,
                        height: props.isColumn ? size : undefined,
                        transform: `translate(${firstTransform[0]}, ${firstTransform[1]})`
                    }}
                >
                    <div
                        className={twMerge(
                            "shadow-black/50 shadow-sm flex rounded-lg overflow-hidden",
                            props.isColumn ? "" : "flex-col"
                        )}
                    >
                        <GapControlButton
                            icon={faImage}
                            onClick={() => {}}
                            tooltip={{
                                content: TOOLTIP.content,
                                place: props.isColumn ? "bottom" : "right"
                            }}
                        />
                        <GapControlButton
                            icon={faTableCellsLarge}
                            onClick={() => {}}
                            tooltip={{
                                content: TOOLTIP.container,
                                place: props.isColumn ? "bottom" : "right"
                            }}
                        />
                        <GapControlButton
                            icon={faTrash}
                            onClick={() => {}}
                            tooltip={{
                                content:
                                    TOOLTIP[
                                        `remove_${
                                            props.isColumn ? "column" : "row"
                                        }`
                                    ],
                                place: props.isColumn ? "bottom" : "right"
                            }}
                        />
                    </div>
                </div>
            )}
            <div
                className={twMerge(
                    "absolute flex overflow-hidden z-50 opacity-20 hover:opacity-100 transition-opacity items-center justify-center",
                    props.isColumn
                        ? "left-0 w-full top-full"
                        : "top-0 h-full left-full"
                )}
                style={{
                    width: props.isColumn ? undefined : size,
                    height: props.isColumn ? size : undefined,
                    transform: `translate(${secondTransform[0]}, ${secondTransform[1]})`
                }}
            >
                <ControlShadow isColumn={props.isColumn}>
                    <GapControlButton
                        icon={faImage}
                        onClick={() => {}}
                        tooltip={{
                            content: TOOLTIP.content,
                            place: props.isColumn ? "top" : "left"
                        }}
                    />
                    <GapControlButton
                        icon={faTableColumns}
                        onClick={() => {}}
                        tooltip={{
                            content: TOOLTIP.container,
                            place: props.isColumn ? "top" : "left"
                        }}
                    />
                    {!props.isLastChild && (
                        <>
                            <GapControlButton
                                icon={faPlus}
                                tooltip={{
                                    content: TOOLTIP.increase_gap,
                                    place: props.isColumn ? "top" : "left"
                                }}
                                onClick={() => {
                                    props.setGap((gap) => {
                                        return Math.max(
                                            0,
                                            gap + GapControl.INCREMENT
                                        );
                                    });
                                }}
                            />
                            <GapControlButton
                                icon={
                                    props.isColumn
                                        ? faRotateLeft
                                        : faRotateRight
                                }
                                onClick={() => {
                                    props.setIsColumn((isStack) => !isStack);
                                }}
                                tooltip={{
                                    content:
                                        TOOLTIP[
                                            props.isColumn
                                                ? "to_row"
                                                : "to_column"
                                        ],
                                    place: props.isColumn ? "top" : "left"
                                }}
                            />
                            <GapControlButton
                                icon={faMinus}
                                onClick={() => {
                                    props.setGap((gap) => {
                                        return Math.max(
                                            0,
                                            gap - GapControl.INCREMENT
                                        );
                                    });
                                }}
                                tooltip={{
                                    content: TOOLTIP.decrease_gap,
                                    place: props.isColumn ? "top" : "left"
                                }}
                            />
                        </>
                    )}
                    <GapControlButton
                        icon={faTrash}
                        onClick={() => {}}
                        tooltip={{
                            content:
                                TOOLTIP[
                                    `remove_${
                                        props.isColumn ? "column" : "row"
                                    }`
                                ],
                            place: props.isColumn ? "top" : "left"
                        }}
                    />
                </ControlShadow>
            </div>
        </>
    );
}

export namespace GapControl {
    export type Props = {
        gap: number;
        setGap: Dispatch<SetStateAction<Props["gap"]>>;

        isColumn: boolean;
        setIsColumn: Dispatch<SetStateAction<Props["isColumn"]>>;

        isFirstChild: boolean;
        isLastChild: boolean;
    };

    export const INCREMENT = 24;
}
