declare type callback<T> = () => Promise<T>;
declare type beforeCallback = () => Promise<void>;
declare type afterCallbacks = () => Promise<void>;
declare namespace PromiseGenerator {
    type Callback<T> = callback<T>;
    type BeforeCallback = beforeCallback;
}
declare class PromiseGenerator<T> {
    private callback?;
    private beforeCallbacks;
    private afterCallbacks;
    set(callback: callback<T>): void;
    before(callback: beforeCallback): void;
    after(callback: afterCallbacks): void;
    run(): Promise<T>;
    destroy(): void;
}
export default PromiseGenerator;
