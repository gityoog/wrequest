import { getErrorMessage, WRequestError } from "../../utils"

namespace SuccessCallback {
  export type Callback<T> = ((data: T) => void) | ((data: T) => Promise<void>)
  export type AfterCallback = (() => void) | (() => Promise<void>)
  export type Map<T, RT> = ((data: T) => RT) | ((data: T) => Promise<RT>)
  export type Validate<T> = ((data: T) => string | void | boolean) | ((data: T) => Promise<string | void | boolean>)
}

class SuccessCallback<T> {
  private callbacks: Array<{
    type: 'normal'
    fn: SuccessCallback.Callback<T>
  } | {
    type: 'map'
    fn: SuccessCallback.Map<T, any>
  } | {
    type: 'validate'
    fn: SuccessCallback.Validate<T>
  }> = []

  private afterCallbacks: Array<SuccessCallback.AfterCallback> = []

  async run(data: T) {
    for (const callback of this.callbacks) {
      switch (callback.type) {
        case 'map':
          data = await callback.fn(data)
          break
        case 'validate':
          const result = await callback.fn(data)
          if (result !== undefined && result !== true) {
            throw new WRequestError(typeof result === 'string' ? result : 'validate fail')
          }
          break
        default:
          await callback.fn(data)
      }
    }
    for (const callback of this.afterCallbacks) {
      await callback()
    }
  }
  add(callback: SuccessCallback.Callback<T>) {
    this.callbacks.push({
      type: 'normal',
      fn: callback
    })
  }
  map(callback: SuccessCallback.Map<T, any>) {
    this.callbacks.push({
      type: 'map',
      fn: callback
    })
  }
  validate(callback: SuccessCallback.Validate<T>) {
    this.callbacks.push({
      type: 'validate',
      fn: callback
    })
  }
  after(callback: SuccessCallback.AfterCallback) {
    this.afterCallbacks.push(callback)
  }
  destroy() {
    this.callbacks = []
    this.afterCallbacks = []
  }
}
export default SuccessCallback