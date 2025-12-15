"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
    faCheck,
    faCog,
    faMoon,
    faSun,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    ActionDispatch,
    Dispatch,
    FunctionComponent,
    ReactNode,
    SetStateAction,
    useMemo,
    useReducer,
    useState
} from "react";
import { twMerge } from "tailwind-merge";
import { DitherSample } from "../api/test/DitherSample";

function TrmnlScreen(
    props: Readonly<{
        isWhite?: boolean;
        screen: FunctionComponent;
    }>
) {
    const [base64, setBase64] = useState<string | null>(null);

    return (
        <div
            className={twMerge(
                "border-[20px] rounded-lg text-black shadow-black/50 shadow-xl",
                // prettier-ignore
                props.isWhite ? "bg-white border-white" : "bg-zinc-800 border-zinc-800"
            )}
        >
            <div className="w-[800] h-[480] rounded-lg overflow-hidden relative bg-white">
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        boxShadow: "inset 0 0 8px #0009"
                    }}
                ></div>

                <props.screen></props.screen>
            </div>
            <div className="text-center pt-[20px] text-black/50 font-bold tracking-widest font-microma h-0 leading-[0]">
                TRMNL
            </div>
        </div>
    );
}

const DEVICES = {
    id1: {
        id: "id1",
        displayName: "Office",
        specialFunction: "restart_playlist",
        isWhite: true
    }
};

type BaseDevice = {
    id: string;
};

type Device = BaseDevice & {
    displayName: string;
    specialFunction: string;
    isWhite: boolean;
};

type DevicesById = Record<Device["id"], Device>;

const SPECIAL_FUNCTIONS = {
    identify: "Identify",
    sleep: "Sleep",
    add_wifi: "Add WiFi",
    restart_playlist: "Restart Playlist",
    rewind: "Rewind",
    send_to_me: "Send to Me"
} as const;

const specialFunctionsSelect = (() => {
    const $options: ReactNode[] = [];
    let width = 0;

    Object.entries(SPECIAL_FUNCTIONS).forEach(([id, name]) => {
        $options.push(
            <option key={id} value={id}>
                {name}
            </option>
        );

        width = Math.max(width, name.length);
    });

    return {
        $options,
        width: `${width}ch`
    };
})();

type DeviceSelectProps = {
    devices: DevicesById;
    deviceId: string | undefined;
    setDeviceId: (id: string) => void;
};
function DeviceSelect(props: DeviceSelectProps) {
    const isDisabled = Object.keys(props.devices).length < 2;

    const select = useMemo(() => {
        let width = 0;
        let $options: ReactNode[] = [];

        for (const [id, device] of Object.entries(props.devices)) {
            $options.push(
                <option key={id} value={id}>
                    {device.displayName}
                </option>
            );

            width = Math.max(width, device.displayName.length);
        }

        return {
            width: `${Math.ceil(width * 1.5)}ch`,
            $options
        };
    }, [props.devices]);

    return (
        <select
            className={twMerge(
                "bg-trmnl w-max border-0 font-microma",
                isDisabled ? "appearance-none" : ""
            )}
            style={{ width: select.width }}
            value={props.deviceId}
            disabled={isDisabled}
            onChange={(event) => {
                return props.setDeviceId(event.target.value);
            }}
        >
            {select.$options}
        </select>
    );
}

type DeviceNameProps = DeviceSelectProps & {
    isSetup: boolean;
    deviceBackground: string;
    device?: Device;
    setIsSetup: Dispatch<SetStateAction<boolean>>;
    updateDevices: DevicesReducer;
};
function DeviceName(props: DeviceNameProps) {
    if (props.isSetup) {
        return (
            <input
                type="text"
                className={twMerge(
                    "pl-[20px] rounded-lg text-trmnl flex-1 outline-none",
                    props.deviceBackground
                )}
                autoFocus
                value={props.device!.displayName}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        props.setIsSetup(false);
                    }
                }}
                onChange={(event) => {
                    props.updateDevices({
                        id: props.device!.id,
                        device: {
                            ...props.device!,
                            displayName: event.target.value
                        }
                    });
                }}
            />
        );
    }

    return (
        <DeviceSelect
            devices={props.devices}
            deviceId={props.deviceId}
            setDeviceId={props.setDeviceId}
        ></DeviceSelect>
    );
}

function ToggleButton(props: {
    deviceBackground: string;
    isEnabled: boolean;
    setIsEnabled: (isEnabled: boolean) => void;
    icon: IconProp;
}) {
    return (
        <button
            className={twMerge(
                "grid place-content-center rounded-lg h-[40] w-[40]",
                props.deviceBackground,
                props.isEnabled ? "" : "bg-transparent",
                props.isEnabled ? "text-trmnl" : ""
            )}
            onClick={() => {
                props.setIsEnabled(!props.isEnabled);
            }}
        >
            <FontAwesomeIcon icon={props.icon}></FontAwesomeIcon>
        </button>
    );
}

type SpecialFunctionProps = {
    device: Device;
    deviceBackground: string;
    specialFunction: string;
    updateDevices: DevicesReducer;
};
function SpecialFunction(props: SpecialFunctionProps) {
    return (
        <select
            className={twMerge(
                "px-[20px] rounded-lg text-trmnl",
                props.deviceBackground
            )}
            style={{ width: specialFunctionsSelect.width }}
            value={props.specialFunction}
            onChange={(e) => {
                props.updateDevices({
                    id: props.device.id,
                    device: {
                        ...props.device,
                        specialFunction: e.target.value
                    }
                });
            }}
        >
            {specialFunctionsSelect.$options}
        </select>
    );
}

type DevicesUpdate = { id: string; device?: Device };
type DevicesReducer = ActionDispatch<[update: DevicesUpdate]>;

export default function Page() {
    const [isSetup, setIsSetup] = useState(false);
    const [devicesUnadopted, setDevicesUnadopted] = useState<BaseDevice[]>([
        {
            id: "EMP-11010"
        }
    ]);

    const [devices, updateDevices] = useReducer(
        (previousDevices: DevicesById, update: DevicesUpdate) => {
            if (update.device) {
                return {
                    ...previousDevices,
                    [update.id]: update.device
                };
            }

            const devices = { ...previousDevices };
            delete devices[update.id];
            return devices;
        },
        DEVICES
    );

    const [deviceId, setDeviceId] = useState<string | undefined>(
        Object.keys(devices)[0]
    );

    const device = deviceId ? devices[deviceId] : undefined;
    const deviceBackground = device?.isWhite ? "bg-white" : "bg-zinc-800";

    return (
        <div className="grid gap-[20px] h-dvh bg-trmnl grid-rows-[1fr_min-content_1fr] grid-cols-[1fr_min-content_1fr]">
            <div></div>
            <div
                className={twMerge(
                    "flex justify-end flex-col font-microma tracking-widest gap-[20px]",
                    device?.isWhite ? "text-white" : "text-zinc-800"
                )}
            >
                <div
                    className={twMerge(
                        "grid gap-x-[20px] gap-y-2",
                        // prettier-ignore
                        isSetup ? "grid-rows-2 grid-cols-[1fr_min-content_min-content_min-content]" : "grid-cols-[min-content_1fr] grid-rows-1"
                    )}
                >
                    {isSetup && (
                        <>
                            <div className="text-xs flex items-end">Name</div>
                            <div className="text-xs flex items-end">
                                Function
                            </div>
                            <div></div>
                            <div></div>
                        </>
                    )}

                    <DeviceName
                        deviceBackground={deviceBackground}
                        deviceId={deviceId}
                        device={device}
                        devices={devices}
                        isSetup={isSetup}
                        setIsSetup={setIsSetup}
                        setDeviceId={setDeviceId}
                        updateDevices={updateDevices}
                    ></DeviceName>

                    {isSetup && (
                        <SpecialFunction
                            deviceBackground={deviceBackground}
                            specialFunction={device!.specialFunction}
                            device={device!}
                            updateDevices={updateDevices}
                        ></SpecialFunction>
                    )}

                    {isSetup && (
                        <ToggleButton
                            deviceBackground={deviceBackground}
                            isEnabled={true}
                            setIsEnabled={() => {
                                updateDevices({
                                    id: device!.id,
                                    device: {
                                        ...device!,
                                        isWhite: !device!.isWhite
                                    }
                                });
                            }}
                            icon={device!.isWhite ? faSun : faMoon}
                        ></ToggleButton>
                    )}

                    <ToggleButton
                        deviceBackground={deviceBackground}
                        icon={isSetup ? faCheck : faCog}
                        isEnabled={isSetup}
                        setIsEnabled={setIsSetup}
                    ></ToggleButton>
                </div>
            </div>
            <div></div>
            <div className="flex justify-end items-start font-microma">
                {devicesUnadopted.map((unadoptedDevice, index) => {
                    return (
                        <div
                            className={twMerge(
                                "p-2 rounded-lg border grid grid-rows-2 gap-2",
                                // prettier-ignore
                                device?.isWhite ? "bg-white/10 border-white text-white" : "bg-zinc-800/10 border-zinc-800 text-zinc-800"
                            )}
                            key={unadoptedDevice.id}
                        >
                            {unadoptedDevice.id}

                            <div className="flex gap-2">
                                <button
                                    className={twMerge(
                                        "bg-emerald-400 text-zinc-800 rounded-lg block p-1 px-3 flex-1 text-sm",
                                        // prettier-ignore
                                        device?.isWhite ? "hover:bg-emerald-300" : "hover:bg-emerald-500"
                                    )}
                                    onClick={() => {
                                        updateDevices({
                                            id: unadoptedDevice.id,
                                            device: {
                                                id: unadoptedDevice.id,
                                                displayName: unadoptedDevice.id,
                                                isWhite: true,
                                                specialFunction: "identify"
                                            }
                                        });

                                        setDevicesUnadopted([
                                            ...devicesUnadopted.slice(0, index),
                                            ...devicesUnadopted.slice(index + 1)
                                        ]);

                                        setDeviceId(unadoptedDevice.id);
                                        setIsSetup(true);
                                    }}
                                >
                                    Adopt
                                </button>
                                <button
                                    className={twMerge(
                                        "bg-red-400 text-zinc-800 rounded-lg p-1 px-3 grid place-content-center",
                                        // prettier-ignore
                                        device?.isWhite ? "hover:bg-red-300" : "hover:bg-red-500"
                                    )}
                                >
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        size="sm"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <TrmnlScreen
                isWhite={device?.isWhite}
                screen={DitherSample}
            ></TrmnlScreen>
            <div></div>
            <div></div>
            <div>Here?</div>
            <div></div>
        </div>
    );
}
