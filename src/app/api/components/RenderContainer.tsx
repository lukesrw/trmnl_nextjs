import { DetailedHTMLProps, HTMLAttributes } from "react";
import { TrmnlRequest } from "../lib/TrmnlRequest";

export type RenderContainerProps = DetailedHTMLProps<
    HTMLAttributes<HTMLElement>,
    HTMLElement
> & {
    trmnlRequest: TrmnlRequest;
};

export function RenderContainer({
    trmnlRequest,
    style,
    children,
    ...props
}: Readonly<RenderContainerProps>) {
    return (
        <main
            {...props}
            style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                ...style,
                display: "flex"
            }}
        >
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#000",
                    color: "#FFF",
                    borderBottomLeftRadius: 16,
                    fontSize: "20px",
                    padding: "0 10px"
                }}
            >
                {trmnlRequest.batteryPercentage}%
            </div>

            {children}
        </main>
    );
}
