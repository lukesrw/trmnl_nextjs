import {
    faImage,
    faMinus,
    faPlus,
    faQuestion,
    faRotateLeft,
    faRotateRight,
    faTableCellsLarge,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

export function AreaHighlight(props: Readonly<AreaHighlight.Props>) {
    const mode = AreaHighlight.MODE[props.mode ?? "debug"];

    return (
        <div
            {...mode.area}
            className={twMerge(
                "pointer-events-none absolute left-0 top-0 z-10 h-full w-full border-4 transition-[opacity,border-color,background-color] duration-500",
                mode.area.className,
                props.mode ? "opacity-100" : "opacity-0"
            )}
        />
    );
}

export namespace AreaHighlight {
    export type Props = {
        mode?: keyof typeof MODE;
    };

    export const MODE = {
        debug: {
            area: {
                className: "border-neutral-500 bg-neutral-500/15"
            },
            icon: {
                icon: faQuestion,
                className: "text-neutral-500"
            }
        },
        delete: {
            area: {
                className: "border-red-500 bg-red-500/15"
            },
            icon: {
                icon: faTrash,
                className: "text-red-500"
            }
        },
        rotateLeft: {
            area: {
                className: "border-blue-500 bg-blue-500/15"
            },
            icon: {
                icon: faRotateLeft,
                className: "text-blue-500"
            }
        },
        rotateRight: {
            area: {
                className: "border-blue-500 bg-blue-500/15"
            },
            icon: {
                icon: faRotateRight,
                className: "text-blue-500"
            }
        },
        increaseGap: {
            area: {
                className: "border-violet-500 bg-violet-500/15"
            },
            icon: {
                icon: faPlus,
                className: "text-violet-500"
            }
        },
        decreaseGap: {
            area: {
                className: "border-violet-500 bg-violet-500/15"
            },
            icon: {
                icon: faMinus,
                className: "text-violet-500"
            }
        },
        content: {
            area: {
                className: "border-green-500 bg-green-500/15"
            },
            icon: {
                icon: faImage,
                className: "text-green-500"
            }
        },
        container: {
            area: {
                className: "border-green-500 bg-green-500/15"
            },
            icon: {
                icon: faTableCellsLarge,
                className: "text-green-500"
            }
        }
    } as const;
}
