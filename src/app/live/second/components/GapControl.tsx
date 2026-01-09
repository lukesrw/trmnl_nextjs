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
import { Dispatch, SetStateAction, useState } from "react";
import { twMerge } from "tailwind-merge";
import { TOOLTIP } from "../data/TOOLTIP";
import { AreaHighlight } from "./AreaHighlight";
import { Control } from "./Control";
import { ControlButton } from "./ControlButton";
import { ControlShadow } from "./ControlShadow";

export function GapControl(props: Readonly<GapControl.Props>) {
    const [firstMode, setFirstMode] = useState<AreaHighlight.Props["mode"]>();
    const [secondMode, setSecondMode] = useState<AreaHighlight.Props["mode"]>();

    /**
     * Ensure the controls are visible even if the gap is smaller than the controls
     */
    const size = Math.max(props.localGap, ControlButton.SIZE);

    /**
     * Adjust the position of the gap controls
     */
    const firstTransform: [string, string] = ["0", "0"];
    const secondTransform: [string, string] = ["0", "0"];
    if (props.isLastChild) {
        secondTransform[props.isColumn ? 1 : 0] = `${-size}px`;
    } else if (props.localGap < size) {
        secondTransform[props.isColumn ? 1 : 0] = `${ControlButton.SIZE * -0.5 + props.localGap * 0.5}px`;
    }

    const classNames: [string, string] = [props.isColumn ? "rounded-t-none" : "rounded-l-none", ""];
    if (props.isLastChild) {
        classNames[1] = props.isColumn ? "rounded-b-none" : "rounded-r-none";
    }

    return (
        <>
            {props.isFirstChild && (
                <Control
                    className={twMerge("left-0 top-0 items-start", props.isColumn ? "w-full" : "h-full flex-col")}
                    style={{
                        width: props.isColumn ? undefined : size,
                        height: props.isColumn ? size : undefined,
                        transform: `translate(${firstTransform[0]}, ${firstTransform[1]})`,
                        gap: ControlButton.SIZE * 0.5
                    }}
                >
                    <ControlShadow isColumn={props.isColumn} className={classNames[0]}>
                        <ControlButton
                            icon={faImage}
                            onMouseEnter={() => setFirstMode("content")}
                            onMouseLeave={() => setFirstMode(undefined)}
                            onClick={() => {}}
                            tooltip={{
                                content: TOOLTIP.content,
                                place: props.isColumn ? "bottom" : "right"
                            }}
                        />
                        <ControlButton
                            icon={faTableCellsLarge}
                            onMouseEnter={() => setFirstMode("container")}
                            onMouseLeave={() => setFirstMode(undefined)}
                            onClick={() => {}}
                            tooltip={{
                                content: TOOLTIP.container,
                                place: props.isColumn ? "bottom" : "right"
                            }}
                        />
                    </ControlShadow>
                    <ControlShadow isColumn={props.isColumn} className={classNames[0]}>
                        <ControlButton
                            icon={faTrash}
                            onMouseEnter={() => props.setMode("delete")}
                            onMouseLeave={() => props.setMode(undefined)}
                            onClick={() => {}}
                            tooltip={{
                                content: TOOLTIP[`remove_${props.isColumn ? "column" : "row"}`],
                                place: props.isColumn ? "bottom" : "right"
                            }}
                        />
                    </ControlShadow>

                    <AreaHighlight mode={firstMode} />
                </Control>
            )}
            <Control
                className={twMerge(
                    props.isColumn ? "left-0 top-full w-full" : "left-full top-0 h-full flex-col",
                    props.isLastChild ? "items-end" : ""
                )}
                style={{
                    width: props.isColumn ? undefined : size,
                    height: props.isColumn ? size : undefined,
                    transform: `translate(${secondTransform[0]}, ${secondTransform[1]})`,
                    gap: ControlButton.SIZE * 0.5
                }}
            >
                <ControlShadow isColumn={props.isColumn} className={classNames[1]}>
                    <ControlButton
                        icon={faImage}
                        onMouseEnter={() => setSecondMode("content")}
                        onMouseLeave={() => setSecondMode(undefined)}
                        onClick={() => {}}
                        tooltip={{
                            content: TOOLTIP.content,
                            place: props.isColumn ? "top" : "left"
                        }}
                    />
                    <ControlButton
                        icon={faTableColumns}
                        onMouseEnter={() => setSecondMode("container")}
                        onMouseLeave={() => setSecondMode(undefined)}
                        onClick={() => {}}
                        tooltip={{
                            content: TOOLTIP.container,
                            place: props.isColumn ? "top" : "left"
                        }}
                    />
                </ControlShadow>
                <ControlShadow isColumn={props.isColumn} className={classNames[1]}>
                    {!props.isLastChild && (
                        <>
                            <ControlButton
                                icon={faPlus}
                                tooltip={{
                                    content: TOOLTIP.increase_gap,
                                    place: props.isColumn ? "top" : "left"
                                }}
                                onMouseEnter={() => props.setMode("increaseGap")}
                                onMouseLeave={() => props.setMode(undefined)}
                                onClick={(event) => {
                                    props.setIsLocalGap(event.shiftKey);
                                    props[event.shiftKey ? "setLocalGap" : "setGap"](GapControl.increaseGap);
                                }}
                            />
                            <ControlButton
                                icon={faMinus}
                                onClick={(event) => {
                                    props.setIsLocalGap(event.shiftKey);
                                    props[event.shiftKey ? "setLocalGap" : "setGap"](GapControl.decreaseGap);
                                }}
                                onMouseEnter={() => props.setMode("decreaseGap")}
                                onMouseLeave={() => props.setMode(undefined)}
                                tooltip={{
                                    content: TOOLTIP.decrease_gap,
                                    place: props.isColumn ? "top" : "left"
                                }}
                            />
                            <ControlButton
                                icon={props.isColumn ? faRotateLeft : faRotateRight}
                                onClick={() => {
                                    props.setIsColumn((isStack) => !isStack);
                                }}
                                onMouseEnter={() => props.setMode(`rotate${props.isColumn ? "Left" : "Right"}`)}
                                onMouseLeave={() => props.setMode(undefined)}
                                tooltip={{
                                    content: TOOLTIP[props.isColumn ? "to_row" : "to_column"],
                                    place: props.isColumn ? "top" : "left"
                                }}
                            />
                        </>
                    )}
                    <ControlButton
                        icon={faTrash}
                        onMouseEnter={() => props.setMode("delete")}
                        onMouseLeave={() => props.setMode(undefined)}
                        onClick={() => {}}
                        tooltip={{
                            content: TOOLTIP[`remove_${props.isColumn ? "column" : "row"}`],
                            place: props.isColumn ? "top" : "left"
                        }}
                    />
                </ControlShadow>

                <AreaHighlight mode={secondMode} />
            </Control>
        </>
    );
}

export namespace GapControl {
    export type Props = {
        localGap: number;
        setLocalGap: Dispatch<SetStateAction<Props["localGap"]>>;
        setGap: Dispatch<SetStateAction<Props["localGap"]>>;
        setIsLocalGap: Dispatch<SetStateAction<boolean>>;

        isColumn: boolean;
        setIsColumn: Dispatch<SetStateAction<Props["isColumn"]>>;

        isFirstChild: boolean;
        isLastChild: boolean;

        setMode: Dispatch<SetStateAction<AreaHighlight.Props["mode"]>>;
    };

    export const INCREMENT = 6;

    export function increaseGap(gap: number) {
        return Math.max(0, gap + GapControl.INCREMENT);
    }

    export function decreaseGap(gap: number) {
        return Math.max(0, gap - GapControl.INCREMENT);
    }
}
