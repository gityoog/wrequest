import { Build, WRequestGenerator } from "./builder"
import AbortCallback from "./callback/abort"
import FailCallback from "./callback/fail"
import FinalCallback from "./callback/final"
import LoadCallback from "./callback/load"
import SuccessCallback from "./callback/success"
import PromiseGenerator from "./generator"
import { getErrorMessage, WRequestError } from "./utils"

namespace WRequest {
  export type Generator<T = void, R = void> = WRequestGenerator<T, R>
}

class WRequest<T = unknown> {
  static Build = Build
  private generator = new PromiseGenerator<T>()
  private loadCallback?: LoadCallback
  private abortCallback?: AbortCallback<T>
  private successCallback?: SuccessCallback<T>
  private failCallback?: FailCallback
  private finalCallback?: FinalCallback

  public debug = {
    delay: (time = 1000): WRequest<T> => {
      this.generator.after(() => new Promise<void>(resolve => {
        setTimeout(() => resolve(), time)
      }))
      return this
    },
    success: (data: T): WRequest<T> => {
      this.generator.set(() => Promise.resolve(data))
      return this
    },
    fail: (error: string): WRequest<T> => {
      this.generator.set(() => Promise.reject(error))
      return this
    }
  }

  private getSuccessCallback() {
    return this.successCallback ||= new SuccessCallback()
  }

  private getFailCallback() {
    return this.failCallback ||= new FailCallback()
  }

  public after = {
    success: (callback: SuccessCallback.AfterCallback): WRequest<T> => {
      this.getSuccessCallback().after(callback)
      return this
    },
    fail: (callback: FailCallback.AfterCallback): WRequest<T> => {
      this.getFailCallback().after(callback)
      return this
    }
  }

  constructor(callback: PromiseGenerator.Callback<T>) {
    this.generator.set(callback)
    setTimeout(() => this.run())
  }

  private async run() {
    try {
      await this.loadCallback?.run()
      const result = await this.generator.run()
      if (await this.abortCallback?.run(result) === true) {
        return this.destroy()
      }
      if (result.type === 'success') {
        await this.successCallback?.run(result.data)
      } else {
        throw new WRequestError(getErrorMessage(result.error))
      }
    } catch (e: unknown) {
      if (!(e instanceof WRequestError)) {
        console.error("RuntimeError", e)
      }
      await this.failCallback?.run(getErrorMessage(e))
    } finally {
      await this.finalCallback?.run()
      this.destroy()
    }
  }
  load(callback: LoadCallback.Callback) {
    this.loadCallback ||= new LoadCallback()
    this.loadCallback.add(callback)
    return this
  }
  abort(callback: AbortCallback.Callback<T>) {
    this.abortCallback ||= new AbortCallback()
    this.abortCallback.add(callback)
    return this
  }
  success(callback: SuccessCallback.Callback<T>) {
    this.getSuccessCallback().add(callback)
    return this
  }
  map<RT>(callback: SuccessCallback.Map<T, RT>) {
    this.getSuccessCallback().map(callback)
    return this as unknown as WRequest<RT>
  }
  transform<RT>(callback: SuccessCallback.Map<T, RT>) {
    return this.map(callback)
  }
  validate(callback: SuccessCallback.Validate<T>) {
    this.getSuccessCallback().validate(callback)
    return this
  }
  fail(callback: FailCallback.Callback) {
    this.getFailCallback().add(callback)
    return this
  }
  final(callback: FinalCallback.Callback) {
    this.finalCallback ||= new FinalCallback()
    this.finalCallback.add(callback)
    return this
  }
  promise() {
    return new Promise<T>((resolve, reject) => {
      this.success(data => {
        resolve(data)
      })
      this.fail(err => {
        reject(err)
        return err
      })
    })
  }
  destroy() {
    this.debug = null!
    this.generator.destroy()
    this.loadCallback?.destroy()
    this.abortCallback?.destroy()
    this.successCallback?.destroy()
    this.failCallback?.destroy()
    this.finalCallback?.destroy()
  }
}

export default WRequest