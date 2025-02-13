import { ditherMethod } from "@/lib/dithering";
import { Render } from "@/lib/Render";
import { PropsWithChildren } from "react";
import { DitherSample } from "../test/DitherSample";

function Frame(props: PropsWithChildren) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                border: "10px solid white",
                background: "#FFF"
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden"
                }}
            >
                {props.children}
            </div>
        </div>
    );
}

export async function GET() {
    const image = await new Render({
        input: {
            type: "jsx",
            component: DitherSample,
            isWhite: true
        },
        dither: {
            method: ditherMethod.uniform4
        }
    }).toBmp();

    return new Response(image);
}
