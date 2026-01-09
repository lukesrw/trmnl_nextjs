import { COLOR } from "./COLOR";

export const DEVICE = {
    og: {
        sizeInCm: {
            width: 17.3,
            height: 11.5,
            bezel: 0.7,
            bottom: 1.3
        },
        screen: {
            width: 800,
            height: 480,
            dpi: 72
        },
        colors: COLOR
    }
} as const;
