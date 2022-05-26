declare namespace AbortCallback {
    type Callback = (() => Promise<boolean | void>) | (() => boolean | void);
}
declare class AbortCallback {
    private callbacks;
    add(callback: AbortCallback.Callback): void;
    run(): Promise<true | undefined>;
    destroy(): void;
}
export default AbortCallback;
