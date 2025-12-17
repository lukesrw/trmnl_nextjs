import { useId } from "react";

export namespace Switch {
    export type Props = {
        label: string;
        isEnabled: boolean;
        setIsEnabled(isEnabled: boolean): void;
    };
}

export function Switch(props: Readonly<Switch.Props>) {
    const id = useId();

    return (
        <label htmlFor={id} className="font-microma text-xl font-medium">
            {props.label}
            <div className="relative ml-4 inline-block h-4 w-10 cursor-pointer">
                <input
                    id={id}
                    type="checkbox"
                    className="peer sr-only"
                    checked={props.isEnabled}
                    onChange={(e) => {
                        props.setIsEnabled(e.currentTarget.checked);
                    }}
                />
                <span className="absolute inset-0 rounded-full bg-zinc-700 transition-colors duration-200 peer-checked:bg-trmnl peer-hover:bg-zinc-600 peer-checked:peer-hover:bg-trmnl peer-active:bg-zinc-500 peer-checked:peer-active:bg-trmnl" />
                <span className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-5 border-2 border-zinc-600 peer-checked:border-trmnl" />
            </div>
        </label>
    );
}
