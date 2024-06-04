import { WRequestOriginError } from "../../utils"

namespace FailCallback {
  export type Callback = ((error: string, origin?: WRequestOriginError) => string | void) | ((error: string, origin?: WRequestOriginError) => Promise<string | void>)
  export type AfterCallback = ((error: string, origin?: WRequestOriginError) => void) | ((error: string, origin?: WRequestOriginError) => Promise<void>)
}
class FailCallback {
  private callbacks: FailCallback.Callback[] = []
  private afterCallbacks: FailCallback.AfterCallback[] = []

  async run(error: string, origin?: WRequestOriginError) {
    for (const callback of this.callbacks) {
      const result = await callback(error, origin)
      if (result === undefined) {
        break
      } else {
        error = result
      }
    }
    for (const callback of this.afterCallbacks) {
      await callback(error, origin)
    }
  }
  add(callback: FailCallback.Callback) {
    this.callbacks.unshift(callback)
  }
  after(callback: FailCallback.Callback) {
    this.afterCallbacks.push(callback)
  }
  destroy() {
    this.callbacks = []
    this.afterCallbacks = []
  }
}

export default FailCallback