import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, useState } from "react";
import { TOOLTIP } from "../data/TOOLTIP";
import { AreaHighlight } from "./AreaHighlight";
import { Control } from "./Control";
import { ControlButton } from "./ControlButton";
import { ControlShadow } from "./ControlShadow";

export function RenderControl(props: Readonly<RenderControl.Props>) {
    const [mode, setMode] = useState<AreaHighlight.Props["mode"]>();

    return (
        <>
            <Control
                className={
                    props.isColumn
                        ? "right-0 top-1/2 h-full -translate-y-1/2"
                        : "bottom-0 left-1/2 w-full -translate-x-1/2"
                }
                style={{
                    height: ControlButton.SIZE,
                    gap: ControlButton.SIZE * 0.5
                }}
            >
                <ControlShadow
                    isColumn={!props.isColumn}
                    className={props.isColumn ? "rounded-r-none" : "rounded-b-none"}
                >
                    <ControlButton
                        icon={faPlus}
                        onClick={() => props.setFlex((props.flex ?? 1) + 1)}
                        tooltip={{
                            content: TOOLTIP.increaseWidth,
                            place: "top"
                        }}
                    />
                    <ControlButton
                        icon={faMinus}
                        isDisabled={props.flex === 1}
                        tooltip={{
                            content: TOOLTIP.decreaseWidth,
                            place: "top"
                        }}
                        onClick={() => props.setFlex(Math.max(0, (props.flex ?? 1) - 1))}
                    />
                </ControlShadow>

                <ControlShadow
                    isColumn={!props.isColumn}
                    className={props.isColumn ? "rounded-r-none" : "rounded-b-none"}
                >
                    <ControlButton
                        icon={faTrash}
                        onMouseEnter={() => setMode("delete")}
                        onMouseLeave={() => setMode(undefined)}
                        onClick={() => {}}
                        tooltip={{
                            content: "Delete Content",
                            place: props.isColumn ? "left" : "top"
                        }}
                    />
                </ControlShadow>
            </Control>

            <AreaHighlight mode={mode} />
        </>
    );
}

export namespace RenderControl {
    export type Props = {
        isColumn: boolean;
        flex?: number;
        setFlex: Dispatch<Props["flex"]>;
    };
}
