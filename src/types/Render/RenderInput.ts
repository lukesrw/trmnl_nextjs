import { CSSProperties, FunctionComponent, PropsWithChildren } from "react";

type RenderInputOptions = {
    /**
     * Inform the render process that the majority of the input is white.
     * Reduce the amount of overhead required to process the image output.
     *
     * Note: Used to set the browser color scheme for `url` inputs.
     */
    isWhite?: boolean;

    /**
     * Desired width for the image to be rendered at.
     * Defaults to the TRMNL screen width.
     */
    width?: number;

    /**
     * Desired height for the image to be rendered at.
     * Defaults to the TRMNL screen height.
     */
    height?: number;

    frame?: FunctionComponent<PropsWithChildren>;
};

export type RenderInputBuffer = Omit<RenderInputOptions, "width" | "height"> & {
    type: "buffer";
    data: Buffer<ArrayBufferLike>;
};

export type RenderInputError = RenderInputOptions & {
    type: "error";
    cause: unknown;
};

export type RenderInputHTML = RenderInputOptions & {
    type: "html";
    content: string;
};

export type RenderInputImage = Omit<RenderInputOptions, "width" | "height"> & {
    type: "image";
    path: string;
};

export type RenderInputJsx = RenderInputOptions & {
    type: "jsx";
    component: FunctionComponent;
};

export type RenderInputText = Omit<RenderInputOptions, "width" | "height"> & {
    type: "text";
    content: string;

    /**
     * @note `fontStyle` isn't supported by ImageResponse currently.
     * @note `fontVariant` isn't supported by ImageResponse currently.
     * @note `fontWeight` isn't supported by ImageResponse currently.
     * @note `wordSpacing` isn't supported by ImageResponse currently.
     *
     * @todo add above styles when they're supported.
     */
    style?: Pick<
        CSSProperties,
        "letterSpacing" | "lineHeight" | "whiteSpace" | "fontSize"
    > & {
        color?: "#000" | "#FFF";
    };
};

export type RenderInputWebsite = RenderInputOptions & {
    type: "url";
    url: string;
    wait?: number;
};

export type RenderInput =
    | RenderInputBuffer
    | RenderInputError
    | RenderInputHTML
    | RenderInputImage
    | RenderInputJsx
    | RenderInputText
    | RenderInputWebsite;
