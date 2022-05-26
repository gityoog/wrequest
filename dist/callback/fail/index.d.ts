declare namespace FailCallback {
    type Callback = ((error: string) => string | void) | ((error: string) => Promise<string | void>);
    type AfterCallback = ((error: string) => void) | ((error: string) => Promise<void>);
}
declare class FailCallback {
    private callbacks;
    private afterCallbacks;
    run(error: string): Promise<void>;
    add(callback: FailCallback.Callback): void;
    after(callback: FailCallback.Callback): void;
    destroy(): void;
}
export default FailCallback;
