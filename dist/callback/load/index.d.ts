declare namespace LoadCallback {
    type Callback = (() => Promise<void>) | (() => void);
}
declare class LoadCallback {
    private callbacks;
    add(callback: LoadCallback.Callback): void;
    run(): Promise<void>;
    destroy(): void;
}
export default LoadCallback;
