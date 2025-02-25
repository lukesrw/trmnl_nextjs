import { ReactNode } from "react";
import { withTailwind } from "./Component";

export function DitherSample() {
    let colours = [
        "bg-black",
        "bg-neutral-900",
        "bg-neutral-800",
        "bg-neutral-700",
        "bg-neutral-600",
        "bg-neutral-500",
        "bg-neutral-400",
        "bg-neutral-300",
        "bg-neutral-200",
        "bg-neutral-100",
        "bg-white"
    ];
    let $Items: ReactNode[] = [];
    let textColour = "text-white";

    colours.forEach((colour, index) => {
        if (index > 5) {
            textColour = "text-black";
        } else if (index === 5) {
            textColour = "text-transparent";
        }

        $Items.push(
            <div
                key={colour}
                {...withTailwind(
                    `flex-1 flex justify-center items-center text-3xl ${textColour} ${colour}`
                )}
            >
                {colour.replace("neutral-", "").substring(3, 4).toUpperCase()}
            </div>
        );
    });

    return (
        <div {...withTailwind("flex w-full h-full flex-col")}>
            <div
                {...withTailwind(
                    "flex h-[72.733px] mb-2 shrink-0 overflow-hidden"
                )}
            >
                {$Items}
            </div>
            <div {...withTailwind("flex flex-1")}>
                <div
                    {...withTailwind("flex flex-col flex-1 shrink-0 p-2 px-4")}
                >
                    <h2 {...withTailwind("w-full text-2xl m-0")}>
                        Lorem ipsum dolor sit amet.
                    </h2>
                    <p {...withTailwind("m-0")}>
                        Consectetur adipisicing elit. Nobis fugit quas nisi quae
                        ducimus quaerat, in odio consectetur quibusdam culpa ea
                        odit cupiditate voluptatibus. Similique odit et ipsa
                        dolorum!
                    </p>
                    <hr {...withTailwind("m-4 my-8 border-black")} />
                    <h2 {...withTailwind("w-full text-2xl m-0")}>
                        Lorem ipsum dolor, sit amet.
                    </h2>
                    <p {...withTailwind("m-0")}>
                        Eaque officia necessitatibus reiciendis hic porro, quo
                        labore provident totam perferendis nostrum rem excepturi
                        at expedita quibusdam possimus. Perferendis, mollitia
                        culpa! Inventore ab incidunt, vel rerum, quia architecto
                        accusamus veniam quo accusantium similique alias enim
                        iure fuga!
                    </p>
                </div>
                <div
                    {...withTailwind(
                        "flex flex-1 shrink-0 overflow-hidden rounded-tl-lg m-0"
                    )}
                >
                    <img
                        src={`http://192.168.0.205:3001/img/pixabay.jpg`}
                        alt="Image"
                        {...withTailwind("w-full h-full object-cover")}
                    />
                </div>
            </div>
        </div>
    );
}
