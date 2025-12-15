"use client";

import { PropsWithChildren, Suspense } from "react";

export default function Layout(props: Readonly<PropsWithChildren>) {
    return (
        <Suspense>
            <Suspense>{props.children}</Suspense>
        </Suspense>
    );
}
