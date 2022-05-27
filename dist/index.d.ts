import AbortCallback from "./callback/abort";
import FailCallback from "./callback/fail";
import FinalCallback from "./callback/final";
import LoadCallback from "./callback/load";
import SuccessCallback from "./callback/success";
import PromiseGenerator from "./generator";
export default class WRequest<T = unknown> {
    private generator;
    private loadCallback?;
    private abortCallback?;
    private successCallback?;
    private failCallback?;
    private finalCallback?;
    debug: {
        delay: (time?: number) => this;
        success: (data: T) => this;
        fail: (error: string) => this;
    };
    private getSuccessCallback;
    private getFailCallback;
    after: {
        success: (callback: SuccessCallback.AfterCallback) => this;
        fail: (callback: FailCallback.AfterCallback) => this;
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
    destroy(): void;
}
