
namespace LoadCallback {
  export type Callback = (() => Promise<void>) | (() => void)
}

class LoadCallback {
  private callbacks: LoadCallback.Callback[] = []
  add(callback: LoadCallback.Callback) {
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

export default LoadCallback