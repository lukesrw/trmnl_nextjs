import { getScreen } from "@/app/api/dashboard/getScreen";
import { RenderOptions } from "@/types/Render/RenderOptions";
import { useQuery } from "@tanstack/react-query";
import { MODES } from "../MODES";

export function useRender(width: number, height: number, config: RenderOptions, mode: (typeof MODES)[number]["name"]) {
    return useQuery({
        queryKey: [width, height, config, mode],
        async queryFn() {
            const data = await getScreen(width, height, config, mode);

            return (
                <img
                    className="h-full w-full bg-transparent"
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
}
