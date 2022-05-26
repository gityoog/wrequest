declare type callback<T> = () => Promise<T>;
declare type beforeCallback = () => Promise<void>;
declare type result<T> = {
    type: 'success';
    data: T;
} | {
    type: 'fail';
    error: unknown;
};
declare type afterCallback<T> = (result: result<T>) => Promise<void>;
declare namespace PromiseGenerator {
    type Callback<T> = callback<T>;
    type BeforeCallback = beforeCallback;
    type AfterCallback<T> = afterCallback<T>;
    type Result<T> = result<T>;
}
declare class PromiseGenerator<T> {
    private callback?;
    private beforeCallbacks;
    private afterCallbacks;
    set(callback: callback<T>): void;
    before(callback: beforeCallback): void;
    after(callback: afterCallback<T>): void;
    run(): Promise<result<T>>;
    destroy(): void;
}
export default PromiseGenerator;
