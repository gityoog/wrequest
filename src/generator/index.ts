type callback<T> = () => Promise<T>
type beforeCallback = () => Promise<void>

namespace PromiseGenerator {
  export type Callback<T> = callback<T>
  export type BeforeCallback = beforeCallback
}

class PromiseGenerator<T> {
  private callback?: callback<T>
  private beforeCallbacks: Array<beforeCallback> = []

  set(callback: callback<T>) {
    this.callback = callback
  }

  before(callback: beforeCallback) {
    this.beforeCallbacks.push(callback)
  }

  async run() {
    for (const beforeCallback of this.beforeCallbacks) {
      await beforeCallback()
    }
    const result = await this.callback!()
    return result
  }

  destroy() {
    this.callback = undefined
    this.beforeCallbacks = []
  }
}

export default PromiseGenerator