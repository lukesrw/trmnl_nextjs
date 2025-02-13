import { PropsWithChildren } from "react";

export function withTailwind(classes: string) {
    return {
        className: classes,
        tw: classes
    };
}

export function Component(props: Readonly<PropsWithChildren>) {
    return (
        <div
            style={{
                fontSize: 64,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                position: "relative"
            }}
        >
            <span>{new Date().toLocaleString()}</span>
        </div>
    );
}
