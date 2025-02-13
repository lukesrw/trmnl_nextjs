import { NextRequest } from "next/server";

export function isTrmnl(request: NextRequest) {
    const headers = Object.fromEntries(request.headers);

    return (
        typeof headers["access-token"] === "string" &&
        headers["access-token"].length > 0 &&
        typeof headers["battery-voltage"] === "string" &&
        headers["battery-voltage"].length > 0 &&
        typeof headers["fw-version"] === "string" &&
        headers["fw-version"].length > 0 &&
        typeof headers["id"] === "string" &&
        headers["id"].length > 0 &&
        typeof headers["refresh-rate"] === "string" &&
        headers["refresh-rate"].length > 0 &&
        typeof headers["rssi"] === "string" &&
        headers["rssi"].length > 0 &&
        typeof headers["user-agent"] === "string" &&
        headers["user-agent"] === "ESP32HTTPClient"
    );
}
