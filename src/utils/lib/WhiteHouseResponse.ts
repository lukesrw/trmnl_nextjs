import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { WhiteHouseError } from "../types/WhiteHouse";

export class WhiteHouseResponse {
    static attemptNextResponse(error: unknown) {
        if (error instanceof Error) {
            return this.toNextResponse(error);
        }

        throw error;
    }

    static toNextResponse(error: Error | WhiteHouseError) {
        if (error instanceof Error) {
            error = {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                developerMessage: error.message,
                userMessage: "Please contact support for assistance",
                errorCode: "UNEXPECTED-ERROR"
            };
        }

        return NextResponse.json<WhiteHouseError>(error, {
            status: error.status,
            statusText: getReasonPhrase(error.status)
        });
    }
}
