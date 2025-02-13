import { withTailwind } from "../test/Component";

export function TestComponent() {
    return <div {...withTailwind("bg-red-500 h-full w-full")}></div>;
}
