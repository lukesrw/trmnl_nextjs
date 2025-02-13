import { withTailwind } from "../test/Component";

export function Replica() {
    return (
        <div {...withTailwind("flex w-full h-full p-2")}>
            <div {...withTailwind("flex-1 flex")}>
                <div
                    {...withTailwind("w-full h-full rounded-lg bg-neutral-400")}
                ></div>
            </div>
            <div {...withTailwind("flex-1 flex-col flex")}>
                <div {...withTailwind("flex-1")}></div>
                <div {...withTailwind("flex-1")}></div>
            </div>
        </div>
    );
}
