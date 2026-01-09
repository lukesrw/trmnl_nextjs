import { RenderOptions } from "@/types/Render/RenderOptions";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Dispatch, JSX, PropsWithChildren, SetStateAction, createContext, useContext, useMemo, useState } from "react";
import { getDevice } from "../getDevice";
import { ModeIndex } from "../MODES";

type DeviceContextValue = {
    device: ReturnType<typeof getDevice>;

    viewMode: ModeIndex;
    setViewMode: Dispatch<SetStateAction<DeviceContextValue["viewMode"]>>;

    pipeline: RenderOptions;
    setPipeline: Dispatch<SetStateAction<DeviceContextValue["pipeline"]>>;

    $Screen: UseQueryResult<JSX.Element, Error>;
};

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function DeviceProvider(
    props: PropsWithChildren<{
        device: DeviceContextValue["device"];
    }>
) {
    const [pipeline, setPipeline] = useState<RenderOptions>({
        input: {
            type: "html",
            content: "<div>Hello World</div>",
            isWhite: false
        }
    });

    const [viewMode, setViewMode] = useState<ModeIndex>(2);

    const $Screen = useQuery({
        queryKey: [],
        async queryFn() {
            return <img />;
        }
    });

    const value = useMemo(
        () => ({
            device: props.device,
            pipeline,
            setPipeline,
            $Screen,
            viewMode,
            setViewMode
        }),
        [props.device, pipeline, props.device.style.frame.backgroundColor, viewMode, setViewMode]
    );

    return <DeviceContext.Provider value={value}>{props.children}</DeviceContext.Provider>;
}

export function useDevice() {
    const deviceContext = useContext(DeviceContext);
    if (!deviceContext) {
        throw new Error("useDevice must be used within a DeviceProvider");
    }

    return deviceContext;
}
