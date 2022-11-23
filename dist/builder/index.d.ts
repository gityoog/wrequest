import WRequest from "..";
export interface WRequestGenerator<T = void, R = void> {
    (params: T): WRequest<R>;
    cache(params: T, keys?: string | string[]): WRequest<R>;
    handle<RR>(handler: (wRequest: WRequest<R>) => WRequest<RR>): WRequestGenerator<T, RR>;
    params<TT>(transformer: (params: TT) => T): WRequestGenerator<TT, R>;
}
export declare function Build<T = void, R = void>(origin: (params: T) => Promise<R>): WRequestGenerator<T, R>;
