namespace FailCallback {
  export type Callback = ((error: string) => string | void) | ((error: string) => Promise<string | void>)
  export type AfterCallback = ((error: string) => void) | ((error: string) => Promise<void>)
}
class FailCallback {
  private callbacks: FailCallback.Callback[] = []
  private afterCallbacks: FailCallback.AfterCallback[] = []

  async run(error: string) {
    for (const callback of this.callbacks) {
      const result = await callback(error)
      if (result === undefined) {
        break
      } else {
        error = result
      }
    }
    for (const callback of this.afterCallbacks) {
      await callback(error)
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