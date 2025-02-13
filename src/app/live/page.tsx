"use client";

import { FunctionComponent, useState } from "react";
import { twMerge } from "tailwind-merge";
import { DitherSample } from "../api/test/DitherSample";

function TrmnlScreen(
    props: Readonly<{
        isWhite?: boolean;
        screen: FunctionComponent;
    }>
) {
    const [base64, setBase64] = useState<string | null>(null);

    return (
        <div
            className={twMerge(
                "border-[20px] rounded-lg text-black shadow-black/50 shadow-xl",
                // prettier-ignore
                props.isWhite ? "bg-white border-white" : "bg-zinc-800 border-zinc-800"
            )}
        >
            <div className="w-[800] h-[480] rounded-lg overflow-hidden relative">
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        boxShadow: "inset 0 0 8px #0009"
                    }}
                ></div>

                <props.screen></props.screen>
            </div>
            <div className="text-center pt-[20px] text-black/50 font-bold tracking-widest font-microma h-0 leading-[0]">
                TRMNL
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <div className="grid place-items-center h-dvh bg-[#f27742]">
            <TrmnlScreen isWhite screen={DitherSample}></TrmnlScreen>
        </div>
    );
}
