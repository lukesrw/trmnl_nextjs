# Render Pipeline

The Project image rendering pipeline currently has the following stages:

1. Input: Retrieve the image from the provided source.
2. Frame (Optional): Wrap the Input stage within a component.
3. Dither: Flatten, resize, and (optionally) dither the Frame stage.
4. Threshold: Resize and convert the Dither stage to black and white.
5. BMP: Resize and convert the Threshold stage to a BMP image.

## Stage 1. Input

The Project takes an input object which sets the source of the image.

The Project supports the following render input types:

### Buffer

```ts
const imageFromFile = await readFile("./path/to/image.png");
const input = {
    type: "buffer",
    data: imageFromFile
};
```

### Error

Dependencies:

```bash
npm i @vercel/og
```

Example:

```ts
const input = {
    type: "error",
    cause: new Error("Something went wrong!")
};
```

### HTML

Dependencies:

```bash
npm i html-react-parser @vercel/og
```

```ts
const input = {
    type: "html",
    content: `<div tw="flex w-full h-full bg-neutral-500">Hello, world!</div>`
};
```

### Image

```ts
const input = {
    type: "image",
    path: "./path/to/image.png"
};
```

### JSX

Dependencies:

```bash
npm i @vercel/og
```

```tsx
const input = {
    type: "jsx",
    component() {
        return <div tw="flex w-full h-full bg-neutral-500">Hello, world!</div>;
    }
};
```

### Text

Dependencies:

```bash
npm i @vercel/og
```

```ts
const input = {
    type: "text",
    value: "Hello world!",
    style: {
        fontSize: 64
    }
};
```

### Website

Dependencies:

```bash
npm i playwright
```

```ts
const input = {
    type: "url",
    url: "https://example.com",
    wait: 3000
};
```
