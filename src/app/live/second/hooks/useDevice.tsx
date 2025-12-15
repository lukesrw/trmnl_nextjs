import { getScreen } from "@/app/api/dashboard/getScreen";
import { RenderOptions } from "@/types/Render/RenderOptions";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import {
    Dispatch,
    JSX,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useState
} from "react";
import { getDevice } from "../getDevice";
import { MODES } from "../MODES";

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
        viewMode: number;
    }>
) {
    const [pipeline, setPipeline] = useState<RenderOptions>({
        input: {
            type: "html",
            content: "<div>Hello World</div>",
            isWhite: false
        }
    });
    const queryKey = useDebounce([pipeline, props.viewMode], 1e3);

    const $Screen = useQuery({
        queryKey,
        async queryFn() {
            const data = await getScreen(pipeline, MODES[props.viewMode].name);

            return (
                <img
                    className="w-full"
                    src={URL.createObjectURL(
                        new Blob([new Uint8Array(data)], {
                            type: "image/bmp"
                        })
                    )}
                    alt=""
                    style={{
                        imageRendering: "pixelated"
                    }}
                />
            );
        }
    });

    return (
        <DeviceContext.Provider
            value={{
                device: props.device,
                pipeline,
                setPipeline,
                $Screen
            }}
        >
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
