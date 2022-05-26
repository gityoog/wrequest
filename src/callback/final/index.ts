namespace FinalCallback {
  export type Callback = (() => Promise<void>) | (() => void)
}
class FinalCallback {
  private callbacks: FinalCallback.Callback[] = []
  add(callback: FinalCallback.Callback) {
    this.callbacks.push(callback)
  }
  async run() {
    for (const callback of this.callbacks) {
      await callback()
    }
  }
  destroy() {
    this.callbacks = []
  }
}

export default FinalCallback