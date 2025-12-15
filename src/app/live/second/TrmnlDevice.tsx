"use client";
import Image from "next/image";
import { TrmnlLogo } from "./components/TrmnlLogo";
import { useDevice } from "./hooks/useDevice";

export function TrmnlDevice() {
    const { device, $Screen } = useDevice();

    return (
        <div className="w-min mx-auto" style={{ perspective: "1000px" }}>
            <div className="flex relative" style={device.style.frame}>
                <div
                    className="bg-neutral-300 flex-1 overflow-hidden relative"
                    style={device.style.screen}
                >
                    {$Screen.isLoading ? (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 w-1/2">
                            <Image
                                alt="TRMNL Logo"
                                src="/img/trmnl.svg"
                                fill
                                className="opacity-10 animate-spin"
                                style={{
                                    animationDuration: "5s"
                                }}
                            />
                        </div>
                    ) : (
                        $Screen.data
                    )}
                    <div
                        className="w-full h-full absolute top-0 left-0"
                        style={device.style.screenShadow}
                    ></div>
                </div>
                <div
                    className="absolute bottom-0 left-0 w-full text-black/50 font-bold tracking-widest font-microma h-0 leading-[0] flex justify-center items-center gap-2"
                    style={device.style.bottom}
                >
                    <div
                        className="relative aspect-square"
                        style={device.style.bottomLogo}
                    >
                        <TrmnlLogo />
                    </div>
                    TRMNL
                </div>
            </div>
        </div>
    );
}
