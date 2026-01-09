"use client";
import { CSSProperties } from "react";
import { COLOR_LIGHT } from "./data/COLOR";
import { DEVICE } from "./data/DEVICE";

const widthInVw = 50;

export function getDevice<TDevice extends keyof typeof DEVICE>(
    deviceVersion: TDevice,
    colorChoice: keyof (typeof DEVICE)[TDevice]["colors"]
) {
    const { sizeInCm, colors, screen } = DEVICE[deviceVersion];
    const sizeInVw = {
        width: widthInVw,
        height: (sizeInCm.height / sizeInCm.width) * widthInVw,
        bezel: (sizeInCm.bezel / sizeInCm.width) * widthInVw,
        bottom: (sizeInCm.bottom / sizeInCm.width) * widthInVw
    } as const;

    const color = colors[colorChoice as keyof typeof colors];
    const boxShadow = `0 0 ${sizeInVw.bezel * 0.5}vw #0005`;

    return {
        color,
        screen,
        isLight: COLOR_LIGHT.includes(color),
        style: {
            frame: {
                width: `${sizeInVw.width}vw`,
                height: `${sizeInVw.height}vw`,
                maxHeight: `${sizeInVw.height}vw`,
                padding: `${sizeInVw.bezel}vw`,
                paddingBottom: `${sizeInVw.bottom}vw`,
                borderRadius: `${sizeInVw.bezel * 0.5}vw`,
                boxShadow,
                backgroundColor: color,
                transformStyle: "preserve-3d",
                transformOrigin: "bottom center",
                animation: "popup .66s ease-in-out forwards"
            },
            screen: {
                borderRadius: `${sizeInVw.bezel * 0.5}vw`
            },
            screenShadow: {
                borderRadius: `${sizeInVw.bezel * 0.5}vw`,
                boxShadow: `inset 0 0 ${sizeInVw.bezel * 0.2}vw #0005`
            },
            bottom: {
                color,
                height: `${sizeInVw.bottom}vw`,
                lineHeight: `${sizeInVw.bottom}vw`,
                fontSize: `${sizeInVw.bottom * 0.3}vw`,
                filter: `drop-shadow(${sizeInVw.bottom * 0.01}vw ${
                    sizeInVw.bottom * 0.01
                }vw ${sizeInVw.bottom * 0.01}vw #0005)`
            },
            bottomLogo: {
                height: `${sizeInVw.bottom * 0.3}vw`
            },
            mode: {
                filter: `drop-shadow(${boxShadow})`
            }
        } satisfies Record<string, CSSProperties>
    } as const;
}
