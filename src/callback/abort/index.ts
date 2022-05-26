
namespace AbortCallback {
  export type Callback = (() => Promise<boolean | void>) | (() => boolean | void)
}

class AbortCallback {
  private callbacks: AbortCallback.Callback[] = []
  add(callback: AbortCallback.Callback) {
    this.callbacks.push(callback)
  }
  async run() {
    for (const callback of this.callbacks) {
      if (await callback() === true) {
        return true
      }
    }
  }
  destroy() {
    this.callbacks = []
  }
}

export default AbortCallback