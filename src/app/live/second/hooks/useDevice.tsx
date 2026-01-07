import { getScreen } from "@/app/api/dashboard/getScreen";
import { RenderOptions } from "@/types/Render/RenderOptions";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
    Dispatch,
    JSX,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useMemo,
    useState
} from "react";
import { getDevice } from "../getDevice";
import { MODES, ModeIndex } from "../MODES";

type DeviceContextValue = {
    device: ReturnType<typeof getDevice>;

    pipeline: RenderOptions;
    setPipeline: Dispatch<SetStateAction<DeviceContextValue["pipeline"]>>;

    $Screen: UseQueryResult<JSX.Element, Error>;
};

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function DeviceProvider(
    props: PropsWithChildren<{
        device: DeviceContextValue["device"];
        viewMode: ModeIndex;
    }>
) {
    const [pipeline, setPipeline] = useState<RenderOptions>({
        input: {
            type: "html",
            content: "<div>Hello World</div>",
            isWhite: false
        }
    });
    // const queryKey = useDebounce([pipeline, props.viewMode], 1e3);

    const $Screen = useQuery({
        queryKey: [pipeline, props.viewMode],
        async queryFn() {
            const data = await getScreen(pipeline, MODES[props.viewMode].name);

            return (
                <img
                    className="w-full h-full bg-transparent"
                    src={URL.createObjectURL(
                        new Blob([new Uint8Array(data)], {
                            type: "image/bmp"
                        })
                    )}
                    alt=""
                    style={{
                        imageRendering: "pixelated",
                        objectPosition: "center",
                        objectFit: "contain"
                    }}
                />
            );
        }
    });

    const value = useMemo(
        () => ({
            device: props.device,
            pipeline,
            setPipeline,
            $Screen
        }),
        [props.device, pipeline, props.device.style.frame.backgroundColor]
    );

    return (
        <DeviceContext.Provider value={value}>
            {props.children}
        </DeviceContext.Provider>
    );
}

export function useDevice() {
    const deviceContext = useContext(DeviceContext);
    if (!deviceContext) {
        throw new Error("useDevice must be used within a DeviceProvider");
    }

    return deviceContext;
}
