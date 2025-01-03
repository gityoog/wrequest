declare namespace SuccessCallback {
    type Callback<T> = ((data: T) => void) | ((data: T) => Promise<void>);
    type AfterCallback = (() => void) | (() => Promise<void>);
    type Map<T, RT> = ((data: T) => RT) | ((data: T) => Promise<RT>);
    type Validate<T> = ((data: T) => string | void | boolean) | ((data: T) => Promise<string | void | boolean>);
}
declare class SuccessCallback<T> {
    private callbacks;
    private afterCallbacks;
    run(data: T): Promise<void>;
    add(callback: SuccessCallback.Callback<T>): void;
    map(callback: SuccessCallback.Map<T, any>): void;
    validate(callback: SuccessCallback.Validate<T>): void;
    removeMap(): void;
    removeValidate(): void;
    after(callback: SuccessCallback.AfterCallback): void;
    destroy(): void;
}
export default SuccessCallback;
