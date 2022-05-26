declare namespace FinalCallback {
    type Callback = (() => Promise<void>) | (() => void);
}
declare class FinalCallback {
    private callbacks;
    add(callback: FinalCallback.Callback): void;
    run(): Promise<void>;
    destroy(): void;
}
export default FinalCallback;
