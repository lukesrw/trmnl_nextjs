import { Dimensions } from "@/utils/types/Screen";

/**
ChatGPT Prompt,

In TypeScript, create a dithering function using the following format:

```
methodName(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
    // Your implementation here
}
```

`Dimensions` is an object with the image dimensions and has `width` and `height` properties.
The `image` argument is a buffer in [R,G,B] format, the output will be shown as a 1-bit black and white image.
Do not change either the argument name, or type - i.e. it must be `image: Buffer<ArrayBufferLike>` and `dimensions: Dimensions`.
Do not destructure the `dimensions` argument, instead use `dimensions.width` and `dimensions.height` directly in your code.

- You should not create a new buffer for the output, instead you should update the existing `image` buffer in place.
- If you need to create any variables for the algorithm, declare them inside the function as const/let.
- If your algorithm requires any new options to be passed in, specify them as a new argument in the function signature.

Your aim is to produce a dither algorithm that does the following:
1. Black and white should not be dithered, they should remain entirely black and entirely white.
2. Colours between black and white should be dithered based on how dark they are.
3. The darker the colour, the less it should be dithered - i.e. lighter colours will have more white pixels.
4. The dithering should be applied to the entire image, not just a specific region.
5. The dithering should be uniform in a grid, rather than random or following another pattern.
*/

export const ditherMethod = {
    basic(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        function updatePixel(index: number, factor: number, error: number) {
            if (index < 0 || index + 2 >= image.length) {
                return;
            }

            image[index] = Math.max(
                0,
                Math.min(255, image[index] + Math.floor((error * factor) / 16))
            );
            image[index + 1] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 1] + Math.floor((error * factor) / 16)
                )
            );
            image[index + 2] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 2] + Math.floor((error * factor) / 16)
                )
            );
        }

        for (let y = 0; y < dimensions.height; y++) {
            for (let x = 0; x < dimensions.width; x++) {
                const i = (y * dimensions.width + x) * 3; // Account for RGB channels
                const oldPixelR = image[i]; // Red channel
                const oldPixelG = image[i + 1]; // Green channel
                const oldPixelB = image[i + 2]; // Blue channel

                // Convert to grayscale using a simple average or weighted method (for dithering)
                const oldPixel = Math.round(
                    (oldPixelR + oldPixelG + oldPixelB) / 3
                );
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                image[i] = newPixel;
                image[i + 1] = newPixel;
                image[i + 2] = newPixel;

                if (x + 1 < dimensions.width) {
                    updatePixel(i + 3, 7, error);
                }
                if (y + 1 < dimensions.height) {
                    if (x > 0) {
                        updatePixel(i + dimensions.width * 3 - 3, 3, error);
                    }

                    updatePixel(i + dimensions.width * 3, 5, error);

                    if (x + 1 < dimensions.width) {
                        updatePixel(i + dimensions.width * 3 + 3, 1, error);
                    }
                }
            }
        }
    },
    circle(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        function updatePixel(index: number, factor: number, error: number) {
            if (index < 0 || index + 2 >= image.length) {
                return;
            }

            image[index] = Math.max(
                0,
                Math.min(255, image[index] + Math.floor((error * factor) / 16))
            );
            image[index + 1] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 1] + Math.floor((error * factor) / 16)
                )
            );
            image[index + 2] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 2] + Math.floor((error * factor) / 16)
                )
            );
        }

        for (let y = 0; y < dimensions.height; y++) {
            for (let x = 0; x < dimensions.width; x++) {
                const i = (y * dimensions.width + x) * 3; // Account for RGB channels
                const oldPixelR = image[i]; // Red channel
                const oldPixelG = image[i + 1]; // Green channel
                const oldPixelB = image[i + 2]; // Blue channel

                // Convert to grayscale using a custom approach (a circular pattern)
                const oldPixel = Math.round(
                    0.5 * oldPixelR + 0.5 * oldPixelG + 0.5 * oldPixelB // Simple average
                );
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                image[i] = newPixel;
                image[i + 1] = newPixel;
                image[i + 2] = newPixel;

                // Circle-based error diffusion (we'll use a circular pattern for spreading)
                const radius = 1; // Small radius for the "circle"
                const diffusionPattern = [
                    { dx: 0, dy: -1, factor: 8 }, // Above
                    { dx: 1, dy: 0, factor: 8 }, // Right
                    { dx: 0, dy: 1, factor: 8 }, // Below
                    { dx: -1, dy: 0, factor: 8 }, // Left
                    { dx: 1, dy: -1, factor: 4 }, // Top-right
                    { dx: -1, dy: -1, factor: 4 }, // Top-left
                    { dx: 1, dy: 1, factor: 4 }, // Bottom-right
                    { dx: -1, dy: 1, factor: 4 } // Bottom-left
                ];

                for (const { dx, dy, factor } of diffusionPattern) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (
                        newX >= 0 &&
                        newX < dimensions.width &&
                        newY >= 0 &&
                        newY < dimensions.height
                    ) {
                        const newIndex = (newY * dimensions.width + newX) * 3;
                        updatePixel(newIndex, factor, error);
                    }
                }
            }
        }
    },
    wave(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        function updatePixel(index: number, factor: number, error: number) {
            if (index < 0 || index + 2 >= image.length) {
                return;
            }

            image[index] = Math.max(
                0,
                Math.min(255, image[index] + Math.floor((error * factor) / 16))
            );
            image[index + 1] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 1] + Math.floor((error * factor) / 16)
                )
            );
            image[index + 2] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 2] + Math.floor((error * factor) / 16)
                )
            );
        }

        for (let y = 0; y < dimensions.height; y++) {
            for (let x = 0; x < dimensions.width; x++) {
                const i = (y * dimensions.width + x) * 3; // Account for RGB channels
                const oldPixelR = image[i]; // Red channel
                const oldPixelG = image[i + 1]; // Green channel
                const oldPixelB = image[i + 2]; // Blue channel

                // Convert to grayscale using a sine-weighted method
                const oldPixel = Math.round(
                    0.3 * oldPixelR + 0.59 * oldPixelG + 0.11 * oldPixelB // Standard luminance formula
                );
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                image[i] = newPixel;
                image[i + 1] = newPixel;
                image[i + 2] = newPixel;

                // Sinusoidal error diffusion (waveform effect)
                const waveLength = 4; // Controls the "frequency" of the wave
                const sineFactors = [
                    { dx: 0, dy: -1, factor: Math.sin(y / waveLength) * 8 }, // Above
                    {
                        dx: 1,
                        dy: 0,
                        factor: Math.sin((x + y) / waveLength) * 6
                    }, // Right
                    {
                        dx: 0,
                        dy: 1,
                        factor: Math.sin((y + 1) / waveLength) * 8
                    }, // Below
                    {
                        dx: -1,
                        dy: 0,
                        factor: Math.sin((x + y - 1) / waveLength) * 6
                    }, // Left
                    {
                        dx: 1,
                        dy: -1,
                        factor: Math.sin((x + y) / waveLength) * 4
                    }, // Top-right
                    {
                        dx: -1,
                        dy: -1,
                        factor: Math.sin((x + y - 1) / waveLength) * 4
                    }, // Top-left
                    {
                        dx: 1,
                        dy: 1,
                        factor: Math.sin((x + y + 1) / waveLength) * 4
                    }, // Bottom-right
                    {
                        dx: -1,
                        dy: 1,
                        factor: Math.sin((x + y + 1) / waveLength) * 4
                    } // Bottom-left
                ];

                for (const { dx, dy, factor } of sineFactors) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (
                        newX >= 0 &&
                        newX < dimensions.width &&
                        newY >= 0 &&
                        newY < dimensions.height
                    ) {
                        const newIndex = (newY * dimensions.width + newX) * 3;
                        updatePixel(newIndex, factor, error);
                    }
                }
            }
        }
    },
    spiral(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        function updatePixel(index: number, factor: number, error: number) {
            if (index < 0 || index + 2 >= image.length) {
                return;
            }

            image[index] = Math.max(
                0,
                Math.min(255, image[index] + Math.floor((error * factor) / 16))
            );
            image[index + 1] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 1] + Math.floor((error * factor) / 16)
                )
            );
            image[index + 2] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 2] + Math.floor((error * factor) / 16)
                )
            );
        }

        for (let y = 0; y < dimensions.height; y++) {
            for (let x = 0; x < dimensions.width; x++) {
                const i = (y * dimensions.width + x) * 3; // Account for RGB channels
                const oldPixelR = image[i]; // Red channel
                const oldPixelG = image[i + 1]; // Green channel
                const oldPixelB = image[i + 2]; // Blue channel

                // Convert to grayscale using a standard weighted average
                const oldPixel = Math.round(
                    0.3 * oldPixelR + 0.59 * oldPixelG + 0.11 * oldPixelB // Luminance
                );
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                image[i] = newPixel;
                image[i + 1] = newPixel;
                image[i + 2] = newPixel;

                // Spiral-based error diffusion (error spreads in a spiral pattern)
                const spiralPattern = [
                    { dx: 0, dy: -1, factor: 8 }, // Above
                    { dx: 1, dy: 0, factor: 6 }, // Right
                    { dx: 0, dy: 1, factor: 4 }, // Below
                    { dx: -1, dy: 0, factor: 2 }, // Left
                    { dx: 1, dy: -1, factor: 4 }, // Top-right
                    { dx: -1, dy: -1, factor: 2 }, // Top-left
                    { dx: 1, dy: 1, factor: 2 }, // Bottom-right
                    { dx: -1, dy: 1, factor: 4 } // Bottom-left
                ];

                // Create a spiral diffusion pattern with factors decreasing as you go outwards
                let factorOffset = 0.2; // Adjusts the spread of the spiral
                for (let i = 0; i < spiralPattern.length; i++) {
                    const { dx, dy, factor } = spiralPattern[i];
                    const spiralFactor = factor * Math.pow(factorOffset, i);
                    const newX = x + dx;
                    const newY = y + dy;
                    if (
                        newX >= 0 &&
                        newX < dimensions.width &&
                        newY >= 0 &&
                        newY < dimensions.height
                    ) {
                        const newIndex = (newY * dimensions.width + newX) * 3;
                        updatePixel(newIndex, spiralFactor, error);
                    }
                }
            }
        }
    },
    zigZag(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        function updatePixel(index: number, factor: number, error: number) {
            if (index < 0 || index + 2 >= image.length) {
                return;
            }

            image[index] = Math.max(
                0,
                Math.min(255, image[index] + Math.floor((error * factor) / 16))
            );
            image[index + 1] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 1] + Math.floor((error * factor) / 16)
                )
            );
            image[index + 2] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 2] + Math.floor((error * factor) / 16)
                )
            );
        }

        for (let y = 0; y < dimensions.height; y++) {
            for (let x = 0; x < dimensions.width; x++) {
                const i = (y * dimensions.width + x) * 3; // Account for RGB channels
                const oldPixelR = image[i]; // Red channel
                const oldPixelG = image[i + 1]; // Green channel
                const oldPixelB = image[i + 2]; // Blue channel

                // Convert to grayscale using a simple weighted average
                const oldPixel = Math.round(
                    0.3 * oldPixelR + 0.59 * oldPixelG + 0.11 * oldPixelB
                );
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                image[i] = newPixel;
                image[i + 1] = newPixel;
                image[i + 2] = newPixel;

                // Zigzag-patterned error diffusion
                const zigzagPattern = [
                    { dx: 1, dy: 0, factor: 7 }, // Right
                    { dx: 1, dy: 1, factor: 5 }, // Bottom-right
                    { dx: 0, dy: 1, factor: 5 }, // Down
                    { dx: -1, dy: 1, factor: 3 }, // Bottom-left
                    { dx: -1, dy: 0, factor: 3 }, // Left
                    { dx: -1, dy: -1, factor: 1 }, // Top-left
                    { dx: 0, dy: -1, factor: 1 }, // Up
                    { dx: 1, dy: -1, factor: 1 } // Top-right
                ];

                // Apply the zigzag pattern to diffuse the error
                for (let i = 0; i < zigzagPattern.length; i++) {
                    const { dx, dy, factor } = zigzagPattern[i];
                    const newX = x + dx;
                    const newY = y + dy;
                    if (
                        newX >= 0 &&
                        newX < dimensions.width &&
                        newY >= 0 &&
                        newY < dimensions.height
                    ) {
                        const newIndex = (newY * dimensions.width + newX) * 3;
                        updatePixel(newIndex, factor, error);
                    }
                }
            }
        }
    },
    radial(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        function updatePixel(index: number, factor: number, error: number) {
            if (index < 0 || index + 2 >= image.length) {
                return;
            }

            image[index] = Math.max(
                0,
                Math.min(255, image[index] + Math.floor((error * factor) / 16))
            );
            image[index + 1] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 1] + Math.floor((error * factor) / 16)
                )
            );
            image[index + 2] = Math.max(
                0,
                Math.min(
                    255,
                    image[index + 2] + Math.floor((error * factor) / 16)
                )
            );
        }

        // Calculate the distance from the center of the image
        function getDistanceFromCenter(x: number, y: number): number {
            const centerX = dimensions.width / 2;
            const centerY = dimensions.height / 2;
            return Math.sqrt(
                Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );
        }

        // Max radius of the image
        const maxDistance = getDistanceFromCenter(0, 0);

        for (let y = 0; y < dimensions.height; y++) {
            for (let x = 0; x < dimensions.width; x++) {
                const i = (y * dimensions.width + x) * 3; // Account for RGB channels
                const oldPixelR = image[i]; // Red channel
                const oldPixelG = image[i + 1]; // Green channel
                const oldPixelB = image[i + 2]; // Blue channel

                // Convert to grayscale using a simple average
                const oldPixel = Math.round(
                    0.3 * oldPixelR + 0.59 * oldPixelG + 0.11 * oldPixelB
                );
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                image[i] = newPixel;
                image[i + 1] = newPixel;
                image[i + 2] = newPixel;

                // Calculate radial error spread intensity based on distance from the center
                const distance = getDistanceFromCenter(x, y);
                const normalizedDistance = distance / maxDistance; // Normalize between 0 and 1
                const spreadFactor = Math.pow(1 - normalizedDistance, 2); // Reduce effect as we move outward

                // Error diffusion spread in all directions
                const directions = [
                    { dx: 1, dy: 0, factor: 7 }, // Right
                    { dx: -1, dy: 0, factor: 7 }, // Left
                    { dx: 0, dy: 1, factor: 6 }, // Down
                    { dx: 0, dy: -1, factor: 6 }, // Up
                    { dx: 1, dy: 1, factor: 5 }, // Bottom-right
                    { dx: -1, dy: 1, factor: 5 }, // Bottom-left
                    { dx: 1, dy: -1, factor: 5 }, // Top-right
                    { dx: -1, dy: -1, factor: 5 } // Top-left
                ];

                // Apply radial effect for error diffusion
                for (let i = 0; i < directions.length; i++) {
                    const { dx, dy, factor } = directions[i];
                    const newX = x + dx;
                    const newY = y + dy;
                    if (
                        newX >= 0 &&
                        newX < dimensions.width &&
                        newY >= 0 &&
                        newY < dimensions.height
                    ) {
                        const newIndex = (newY * dimensions.width + newX) * 3;
                        updatePixel(newIndex, factor * spreadFactor, error); // Apply radial spread
                    }
                }
            }
        }
    },
    verticalLines(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        const width = dimensions.width;
        const height = dimensions.height;

        // Convert the image buffer to a 2D array of pixel data (grayscale values)
        const pixels: number[][] = [];
        for (let y = 0; y < height; y++) {
            pixels[y] = [];
            for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 4; // Assuming RGBA format
                const r = image[pixelIndex];
                const g = image[pixelIndex + 1];
                const b = image[pixelIndex + 2];

                // Convert to grayscale using the luminance formula
                const grayscale = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                pixels[y][x] = grayscale;
            }
        }

        // Apply Floyd-Steinberg dithering
        for (let y = 0; y < height - 1; y++) {
            for (let x = 0; x < width - 1; x++) {
                const oldPixel = pixels[y][x];
                const newPixel = oldPixel > 127 ? 255 : 0; // Binary threshold
                pixels[y][x] = newPixel;

                const error = oldPixel - newPixel;

                // Distribute the error to neighboring pixels
                if (x + 1 < width) pixels[y][x + 1] += (error * 7) / 16;
                if (y + 1 < height) {
                    if (x > 0) pixels[y + 1][x - 1] += (error * 3) / 16;
                    pixels[y + 1][x] += (error * 5) / 16;
                    if (x + 1 < width) pixels[y + 1][x + 1] += (error * 1) / 16;
                }
            }
        }

        // Convert the grayscale 2D array back to the image buffer
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 4;
                const grayscale = pixels[y][x];

                // Set the new pixel values in the buffer (using grayscale for R, G, and B)
                image[pixelIndex] = grayscale; // Red
                image[pixelIndex + 1] = grayscale; // Green
                image[pixelIndex + 2] = grayscale; // Blue
                image[pixelIndex + 3] = 255; // Alpha (fully opaque)
            }
        }
    },
    lowPalette(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        const width = dimensions.width;
        const height = dimensions.height;

        // Define a restricted color palette: just 4 colors for a retro feel
        const palette = [
            { r: 0, g: 0, b: 0 }, // Black
            { r: 255, g: 255, b: 255 }, // White
            { r: 85, g: 85, b: 85 }, // Dark gray
            { r: 170, g: 170, b: 170 } // Light gray
        ];

        // Convert the image buffer to a 2D array of pixel data (grayscale values)
        const pixels: number[][] = [];
        for (let y = 0; y < height; y++) {
            pixels[y] = [];
            for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 3; // Assuming RGB format
                const r = image[pixelIndex];
                const g = image[pixelIndex + 1];
                const b = image[pixelIndex + 2];

                // Convert to grayscale using the luminance formula
                const grayscale = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                pixels[y][x] = grayscale;
            }
        }

        // Apply checkerboard dithering: alternating patterns based on pixel brightness
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const oldPixel = pixels[y][x];
                let newPixel: number;

                // Create a simple checkerboard pattern based on the pixel coordinates
                const checkerboard = (x + y) % 2 === 0 ? 0 : 255;

                // Choose a color from the restricted palette based on the brightness of the pixel
                if (oldPixel < 85) {
                    newPixel = 0; // Use black
                } else if (oldPixel < 170) {
                    newPixel = checkerboard; // Use either black or white for the checkerboard effect
                } else {
                    newPixel = 255; // Use white
                }

                // Find the closest color from the palette
                let closestColor = palette[0];
                let closestDistance = Math.abs(newPixel - closestColor.r);

                for (const color of palette) {
                    const distance = Math.abs(newPixel - color.r);
                    if (distance < closestDistance) {
                        closestColor = color;
                        closestDistance = distance;
                    }
                }

                // Set the pixel in the buffer with the chosen palette color
                const pixelIndex = (y * width + x) * 3; // No alpha channel, so we only set RGB
                image[pixelIndex] = closestColor.r; // Red
                image[pixelIndex + 1] = closestColor.g; // Green
                image[pixelIndex + 2] = closestColor.b; // Blue
            }
        }
    },
    image(image: Buffer<ArrayBufferLike>, dimensions: Dimensions) {
        const { width, height } = dimensions;
        const errorDiffusion = new Float32Array(width * height); // To store error diffusion

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 3;
                const r = image[index];
                const g = image[index + 1];
                const b = image[index + 2];

                // Convert to grayscale
                let grayscale = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                grayscale += errorDiffusion[y * width + x];

                // Apply 16-bit bounce noise
                const noise = (((x * 7 + y * 3) & 0xf) / 15.0) * 255; // Pseudo-random 16-bit noise
                grayscale += noise - 128;

                // Thresholding
                const newPixel = grayscale >= 128 ? 255 : 0;
                const error = grayscale - newPixel;

                // Store pixel in image buffer
                image[index] = image[index + 1] = image[index + 2] = newPixel;

                // Floyd-Steinberg error diffusion
                if (x + 1 < width)
                    errorDiffusion[y * width + (x + 1)] += (error * 7) / 16;
                if (y + 1 < height) {
                    if (x > 0)
                        errorDiffusion[(y + 1) * width + (x - 1)] +=
                            (error * 3) / 16;
                    errorDiffusion[(y + 1) * width + x] += (error * 5) / 16;
                    if (x + 1 < width)
                        errorDiffusion[(y + 1) * width + (x + 1)] +=
                            (error * 1) / 16;
                }
            }
        }
    },
    uniform4(image: Buffer, dimensions: Dimensions) {
        const { width, height } = dimensions;

        // 4x4 Bayer matrix
        const bayerMatrix = [
            [0, 8, 2, 10],
            [12, 4, 14, 6],
            [3, 11, 1, 9],
            [15, 7, 13, 5]
        ].map((row) => row.map((v) => (v / 16) * 255)); // Scale to 0-255

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 3;
                const r = image[index];
                const g = image[index + 1];
                const b = image[index + 2];

                // Convert to grayscale (perceived brightness)
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

                // Bayer threshold for this pixel
                const threshold = bayerMatrix[y % 4][x % 4];

                // Apply thresholding
                const newValue = brightness > threshold ? 255 : 0;

                // Update buffer in place
                image[index] = image[index + 1] = image[index + 2] = newValue;
            }
        }
    },
    uniform2(image: Buffer, dimensions: Dimensions) {
        const { width, height } = dimensions;

        // 2x2 Bayer matrix (scaled to 0-255 range)
        const bayerMatrix = [
            [0, 128],
            [192, 64]
        ];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 3;
                const r = image[index];
                const g = image[index + 1];
                const b = image[index + 2];

                // Convert to grayscale (perceived brightness)
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

                // Bayer threshold for this pixel
                const threshold = bayerMatrix[y % 2][x % 2];

                // Apply thresholding
                const newValue = brightness > threshold ? 255 : 0;

                // Update buffer in place
                image[index] = image[index + 1] = image[index + 2] = newValue;
            }
        }
    }
};
