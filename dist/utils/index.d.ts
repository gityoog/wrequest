export declare function getErrorMessage(e: unknown, def?: string): string;
/**@deprecated */
export declare class WRequestError extends Error {
    constructor(message: string);
}
export declare class WRequestOriginError extends WRequestError {
    data: unknown;
    code: string;
    constructor({ message, code, data }: {
        message: string;
        code: string;
        data: unknown;
    });
}
