import AbortCallback from "./callback/abort"
import FailCallback from "./callback/fail"
import FinalCallback from "./callback/final"
import LoadCallback from "./callback/load"
import SuccessCallback from "./callback/success"
import PromiseGenerator from "./generator"
import { getErrorMessage } from "./utils"

export default class WRequest<T = any> {
  private generator = new PromiseGenerator<T>()
  private loadCallback = new LoadCallback()
  private abortCallback = new AbortCallback()
  private successCallback = new SuccessCallback<T>()
  private failCallback = new FailCallback()
  private finalCallback = new FinalCallback()

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

  public after = {
    success: (callback: SuccessCallback.AfterCallback): WRequest<T> => {
      this.successCallback.after(callback)
      return this
    },
    fail: (callback: FailCallback.AfterCallback): WRequest<T> => {
      this.failCallback.after(callback)
      return this
    }
  }

  constructor(callback: PromiseGenerator.Callback<T>) {
    this.generator.set(callback)
    setTimeout(() => this.run())
  }

  private async run() {
    try {
      await this.loadCallback.run()
      const result = await this.generator.run()
      if (await this.abortCallback.run() === true) {
        this.destroy()
        return
      }
      await this.successCallback.run(result)
    } catch (e: unknown) {
      await this.failCallback.run(getErrorMessage(e))
    } finally {
      await this.finalCallback.run()
      this.destroy()
    }
  }
  load(callback: LoadCallback.Callback) {
    this.loadCallback.add(callback)
    return this
  }
  abort(callback: AbortCallback.Callback) {
    this.abortCallback.add(callback)
    return this
  }
  success(callback: SuccessCallback.Callback<T>) {
    this.successCallback.add(callback)
    return this
  }
  map<RT>(callback: SuccessCallback.Map<T, RT>) {
    this.successCallback.map(callback)
    return this as unknown as WRequest<RT>
  }
  transform<RT>(callback: SuccessCallback.Map<T, RT>) {
    return this.map(callback)
  }
  validate(callback: SuccessCallback.Validate<T>) {
    this.successCallback.validate(callback)
    return this
  }
  fail(callback: FailCallback.Callback) {
    this.failCallback.add(callback)
    return this
  }
  final(callback: FinalCallback.Callback) {
    this.finalCallback.add(callback)
    return this
  }
  destroy() {
    this.debug = null!
    this.generator.destroy()
    this.loadCallback.destroy()
    this.abortCallback.destroy()
    this.successCallback.destroy()
    this.failCallback.destroy()
    this.finalCallback.destroy()
  }
}