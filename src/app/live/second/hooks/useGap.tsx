import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from "react";

type GapContextValue = {
    gap: number;
    setGap: Dispatch<SetStateAction<GapContextValue["gap"]>>;
};

const GapContext = createContext<GapContextValue | null>(null);

export function GapProvider(props: Readonly<PropsWithChildren>) {
    const [gap, setGap] = useState(0);

    return <GapContext.Provider value={{ gap, setGap }}>{props.children}</GapContext.Provider>;
}

export function useGap() {
    const gapContext = useContext(GapContext);
    if (!gapContext) {
        throw new Error("useGap must be used within a GapProvider");
    }

    return gapContext;
}
