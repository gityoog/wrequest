import PromiseGenerator from "../../generator"

namespace AbortCallback {
  export type Callback<T> = ((result: PromiseGenerator.Result<T>) => Promise<boolean | void>) | ((result: PromiseGenerator.Result<T>) => boolean | void)
}

class AbortCallback<T> {
  private callbacks: AbortCallback.Callback<T>[] = []
  add(callback: AbortCallback.Callback<T>) {
    this.callbacks.push(callback)
  }
  async run(result: PromiseGenerator.Result<T>) {
    for (const callback of this.callbacks) {
      if (await callback(result) === true) {
        return true
      }
    }
  }
  destroy() {
    this.callbacks = []
  }
}

export default AbortCallback