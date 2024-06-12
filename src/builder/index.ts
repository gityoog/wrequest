import WRequest from ".."

export interface WRequestGenerator<T = void, R = void> {
  (params: T): WRequest<R>
  cache(params: T, keys?: string | string[]): WRequest<R>
  handle<RR>(handler: (wRequest: WRequest<R>) => WRequest<RR>): WRequestGenerator<T, RR>
  params<TT>(transformer: (params: TT) => T): WRequestGenerator<TT, R>
  map<RR>(transformer: (data: R) => RR): WRequestGenerator<T, RR>
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
    return Generator as unknown as WRequestGenerator<T, RR>
  }

  Generator.params = function <TT>(transformer: (params: TT) => T) {
    transformers.unshift(transformer)
    return Generator as unknown as WRequestGenerator<TT, R>
  }

  Generator.map = function <RR>(transformer: (data: R) => RR) {
    return Generator.handle(wRequest => wRequest.map(transformer))
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
      const wRequest = Generator(params)
      cache.set(key, wRequest.promise())
      wRequest.after.fail(() => {
        cache.delete(key)
      })
      return wRequest
    }
  }
  return Generator
}