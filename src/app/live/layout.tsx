"use client";

import adapter from "next-query-params/app";
import { PropsWithChildren, Suspense } from "react";
import { QueryParamProvider } from "use-query-params";

export default function Layout(props: Readonly<PropsWithChildren>) {
    return (
        <Suspense>
            <QueryParamProvider adapter={adapter}>
                <Suspense>{props.children}</Suspense>
            </QueryParamProvider>
        </Suspense>
    );
}
