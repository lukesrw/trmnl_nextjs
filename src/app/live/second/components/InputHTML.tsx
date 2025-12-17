import { useDevice } from "../hooks/useDevice";
import { Switch } from "./Switch";
import { TextArea } from "./TextArea";

export function InputHTML() {
    const { pipeline, setPipeline } = useDevice();
    if (pipeline.input.type !== "html") {
        return;
    }

    return (
        <>
            <Switch
                label="White Background"
                isEnabled={!!pipeline.input.isWhite}
                setIsEnabled={(isEnabled) => {
                    setPipeline((pipeline) => {
                        return {
                            ...pipeline,
                            input: {
                                ...pipeline.input,
                                isWhite: isEnabled
                            }
                        };
                    });
                }}
            />
            <TextArea
                label="HTML Content"
                value={pipeline.input.content}
                style={{
                    borderBottomRightRadius: "0"
                }}
                setValue={(value) => {
                    setPipeline((pipeline) => {
                        return {
                            ...pipeline,
                            input: {
                                ...pipeline.input,
                                content: value
                            }
                        };
                    });
                }}
            ></TextArea>
        </>
    );
}
