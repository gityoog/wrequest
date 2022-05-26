type callback<T> = () => Promise<T>
type beforeCallback = () => Promise<void>
type afterCallbacks = () => Promise<void>

namespace PromiseGenerator {
  export type Callback<T> = callback<T>
  export type BeforeCallback = beforeCallback
}

class PromiseGenerator<T> {
  private callback?: callback<T>
  private beforeCallbacks: Array<beforeCallback> = []
  private afterCallbacks: Array<afterCallbacks> = []

  set(callback: callback<T>) {
    this.callback = callback
  }

  before(callback: beforeCallback) {
    this.beforeCallbacks.push(callback)
  }

  after(callback: afterCallbacks) {
    this.afterCallbacks.push(callback)
  }

  async run() {
    for (const beforeCallback of this.beforeCallbacks) {
      await beforeCallback()
    }
    const result = await this.callback!()
    for (const afterCallback of this.afterCallbacks) {
      await afterCallback()
    }
    return result
  }

  destroy() {
    this.callback = undefined
    this.beforeCallbacks = []
    this.afterCallbacks = []
  }
}

export default PromiseGenerator