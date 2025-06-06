import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import { Michroma } from "next/font/google";
import "./globals.css";

config.autoAddCss = false;

const michroma = Michroma({
    variable: "--font-microma",
    subsets: ["latin"],
    weight: ["400"]
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${michroma.variable} antialiased`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
