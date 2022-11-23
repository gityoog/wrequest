import WRequest from ".."

export interface WRequestGenerator<T = void, R = void> {
  (params: T): WRequest<R>
  cache(params: T, keys?: string | string[]): WRequest<R>
  handle<RR>(handler: (wRequest: WRequest<R>) => WRequest<RR>): WRequestGenerator<T, RR>
  params<TT>(transformer: (params: TT) => T): WRequestGenerator<TT, R>
}

export function Build<T = void, R = void>(origin: (params: T) => Promise<R>): WRequestGenerator<T, R> {
  const handles: Array<(wRequest: WRequest<any>) => WRequest<any>> = []
  const transformers: Array<(params: any) => any> = []
  const Generator: WRequestGenerator<T, R> = function (params: T) {
    for (const transformer of transformers) {
      params = transformer(params)
    }
    let wRequest = new WRequest(() => origin(params))
    for (const handle of handles) {
      wRequest = handle(wRequest) as WRequest<R>
    }
    return wRequest
  }
  Generator.handle = function <RR>(handler: (wRequest: WRequest<R>) => WRequest<RR>) {
    handles.push(handler)
    return this as unknown as WRequestGenerator<T, RR>
  }

  Generator.params = function <TT>(transformer: (params: TT) => T) {
    transformers.push(transformer)
    return this as unknown as WRequestGenerator<TT, R>
  }

  let cache: Map<string, Promise<R>>
  Generator.cache = function (params, keys) {
    if (!cache) {
      cache = new Map()
    }
    const key = keys?.toString() || JSON.stringify(params) || 'default'
    if (cache.has(key)) {
      const result = cache.get(key)!
      return new WRequest(() => result)
    } else {
      const wRequest = this(params)
      cache.set(key, wRequest.promise())
      wRequest.after.fail(() => {
        cache.delete(key)
      })
      return wRequest
    }
  }
  return Generator
}