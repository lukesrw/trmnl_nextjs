import { StatusCodes } from "http-status-codes";

export type WhiteHouseError = {
    /**
     * The HTTP status code of this error, must also be set in `init` argument.
     */
    status: StatusCodes;

    /**
     * Verbose, plain language description of the problem for developers.
     */
    developerMessage: string;

    /**
     * Verbose, plain language description of the problem for users.
     */
    userMessage: string;

    /**
     * Optional ID representing the specific error.
     */
    errorCode?: string;

    /**
     * Optional URL to a page with more information about the error.
     */
    moreInfo?: string;
};
