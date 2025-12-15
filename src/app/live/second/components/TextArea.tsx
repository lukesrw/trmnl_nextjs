import { CSSProperties } from "react";
import { useDevice } from "../page";

export namespace TextArea {
    export type Props = {
        label: string;
        value: string;
        setValue(value: string): void;
        rows?: number;
        style?: CSSProperties;
    };
}

export function TextArea(props: Readonly<TextArea.Props>) {
    const { device } = useDevice();

    return (
        <label className="block">
            <span className="font-microma text-xl font-medium">
                {props.label}
            </span>
            <textarea
                className="mt-2 p-4 w-full whitespace-pre font-mono outline-none"
                value={props.value}
                rows={props.rows}
                onChange={(e) => props.setValue(e.currentTarget.value)}
                style={{
                    border: `2px solid ${device.color}`,
                    borderRadius: device.style.frame.borderRadius,
                    borderBottomRightRadius: "0",
                    ...props.style
                }}
            ></textarea>
        </label>
    );
}
