import { Input } from "./components/Input";

export const MODES = [
    {
        name: "Input",
        Component: Input
    },
    {
        name: "Frame",
        Component: function () {
            return <div>Frame</div>;
        }
    },
    {
        name: "Dither",
        Component: function () {
            return <div>Dither</div>;
        }
    },
    {
        name: "Threshold",
        Component: function () {
            return <div>Threshold</div>;
        }
    },
    {
        name: "Preview"
    }
] as const;
