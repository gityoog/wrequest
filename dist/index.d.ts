import { Build, WRequestGenerator } from "./builder";
import AbortCallback from "./callback/abort";
import FailCallback from "./callback/fail";
import FinalCallback from "./callback/final";
import LoadCallback from "./callback/load";
import SuccessCallback from "./callback/success";
import PromiseGenerator from "./generator";
import { WRequestError, WRequestOriginError } from "./utils";
declare namespace WRequest {
    type Generator<T = void, R = void> = WRequestGenerator<T, R>;
}
declare class WRequest<T = unknown> {
    static Build: typeof Build;
    private generator;
    private loadCallback?;
    private abortCallback?;
    private successCallback?;
    private failCallback?;
    private finalCallback?;
    debug: {
        delay: (time?: number) => WRequest<T>;
        success: (data: T) => WRequest<T>;
        fail: (error: string) => WRequest<T>;
    };
    private getSuccessCallback;
    private getFailCallback;
    after: {
        success: (callback: SuccessCallback.AfterCallback) => WRequest<T>;
        fail: (callback: FailCallback.AfterCallback) => WRequest<T>;
    };
    constructor(callback: PromiseGenerator.Callback<T>);
    private run;
    load(callback: LoadCallback.Callback): this;
    abort(callback: AbortCallback.Callback<T>): this;
    success(callback: SuccessCallback.Callback<T>): this;
    map<RT>(callback: SuccessCallback.Map<T, RT>): WRequest<RT>;
    transform<RT>(callback: SuccessCallback.Map<T, RT>): WRequest<RT>;
    validate(callback: SuccessCallback.Validate<T>): this;
    fail(callback: FailCallback.Callback): this;
    final(callback: FinalCallback.Callback): this;
    promise(): Promise<T>;
    concat<R>(callback: (data: T) => WRequest<R>): WRequest<R>;
    destroy(): void;
}
export default WRequest;
export { WRequestError, WRequestOriginError };
