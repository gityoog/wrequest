declare type callback<T> = () => Promise<T>;
declare type beforeCallback = () => Promise<void>;
declare type result<T> = {
    type: 'success';
    data: T;
} | {
    type: 'fail';
    error: unknown;
};
declare namespace PromiseGenerator {
    type Callback<T> = callback<T>;
    type BeforeCallback = beforeCallback;
}
declare class PromiseGenerator<T> {
    private callback?;
    private beforeCallbacks;
    set(callback: callback<T>): void;
    before(callback: beforeCallback): void;
    run(): Promise<result<T>>;
    destroy(): void;
}
export default PromiseGenerator;
