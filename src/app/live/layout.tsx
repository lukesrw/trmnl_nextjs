"use client";

import adapter from "next-query-params/app";
import { PropsWithChildren } from "react";
import { QueryParamProvider } from "use-query-params";

export default function Layout(props: Readonly<PropsWithChildren>) {
    return (
        <QueryParamProvider adapter={adapter}>
            {props.children}
        </QueryParamProvider>
    );
}
