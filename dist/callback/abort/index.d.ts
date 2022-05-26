import PromiseGenerator from "../../generator";
declare namespace AbortCallback {
    type Callback<T> = ((result: PromiseGenerator.Result<T>) => Promise<boolean | void>) | ((result: PromiseGenerator.Result<T>) => boolean | void);
}
declare class AbortCallback<T> {
    private callbacks;
    add(callback: AbortCallback.Callback<T>): void;
    run(result: PromiseGenerator.Result<T>): Promise<true | undefined>;
    destroy(): void;
}
export default AbortCallback;
