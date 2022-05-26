type callback<T> = () => Promise<T>
type beforeCallback = () => Promise<void>
type result<T> = { type: 'success', data: T } | { type: 'fail', error: unknown }
type afterCallback<T> = (result: result<T>) => Promise<void>

namespace PromiseGenerator {
  export type Callback<T> = callback<T>
  export type BeforeCallback = beforeCallback
  export type AfterCallback<T> = afterCallback<T>
  export type Result<T> = result<T>
}

class PromiseGenerator<T> {
  private callback?: callback<T>
  private beforeCallbacks: Array<beforeCallback> = []
  private afterCallbacks: Array<afterCallback<T>> = []

  set(callback: callback<T>) {
    this.callback = callback
  }

  before(callback: beforeCallback) {
    this.beforeCallbacks.push(callback)
  }

  after(callback: afterCallback<T>) {
    this.afterCallbacks.push(callback)
  }
  async run() {
    for (const beforeCallback of this.beforeCallbacks) {
      await beforeCallback()
    }
    let result: result<T>
    try {
      const data = await this.callback!()
      result = { type: 'success', data }
    } catch (e) {
      result = { type: 'fail', error: e }
    }
    for (const afterCallback of this.afterCallbacks) {
      await afterCallback(result)
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