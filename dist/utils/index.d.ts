export declare function getErrorMessage(e: unknown, def?: string): string;
export declare class WRequestError extends Error {
    constructor(message: string);
}
