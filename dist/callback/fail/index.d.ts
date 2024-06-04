import { WRequestOriginError } from "../../utils";
declare namespace FailCallback {
    type Callback = ((error: string, origin?: WRequestOriginError) => string | void) | ((error: string, origin?: WRequestOriginError) => Promise<string | void>);
    type AfterCallback = ((error: string, origin?: WRequestOriginError) => void) | ((error: string, origin?: WRequestOriginError) => Promise<void>);
}
declare class FailCallback {
    private callbacks;
    private afterCallbacks;
    run(error: string, origin?: WRequestOriginError): Promise<void>;
    add(callback: FailCallback.Callback): void;
    after(callback: FailCallback.Callback): void;
    destroy(): void;
}
export default FailCallback;
