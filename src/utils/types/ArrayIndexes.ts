export namespace ArrayIndexes {
    export type AsStrings<TArray extends readonly any[]> = Exclude<
        keyof TArray,
        keyof (readonly any[])
    >;

    export type AsNumbers<TArray extends readonly any[]> =
        AsStrings<TArray> extends infer TKey
            ? TKey extends `${infer TIndex extends number}`
                ? TIndex
                : never
            : never;
}
