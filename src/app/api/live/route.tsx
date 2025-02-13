import { WhiteHouseResponse } from "@/utils/lib/WhiteHouseResponse";
import { NextRequest } from "next/server";
import { display } from "../[...parts]/lib/display";
import { TrmnlRequest } from "../lib/TrmnlRequest";

export async function GET(request: NextRequest) {
    try {
        return await display(new TrmnlRequest(request));
    } catch (error) {
        console.error(error);

        return WhiteHouseResponse.attemptNextResponse(error);
    }
}
