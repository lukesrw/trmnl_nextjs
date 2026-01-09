export const COLOR = {
    black: "#2a2a2a",
    /**
     * Clear should look like semi-transparent colour without actually being one.
     * In order to update this, set "clear" to "#ffffff55" and then sample the colour.
     * Update "clear" to the sampled colour in order to maintain the transparent look.
     */
    clear: "#fa9887",
    white: "#f7f7f7",
    sage: "#b1c7a7",
    wood: "#cbb294",
    grey: "#808080"
} as const;

export const COLOR_LIGHT: string[] = [COLOR.clear, COLOR.white];
