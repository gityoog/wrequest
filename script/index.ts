import WRequest from '../dist'

new WRequest(() => new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('success')
    } else {
      reject('error')
    }
  }, 1000)
}))
  .load(() => {
    console.log("load")
  })
  .success(data => {
    console.log(data)
  })
  .map(data => {
    console.log('transform', data)
    return {
      test: data
    }
  })
  .success(data => {
    console.log("success", data)
  })
  .fail(e => {
    console.log("new error", e)
  })
  .fail(e => {
    console.log("old error", e)
    return "change error"
  })
  .final(() => {
    console.log("final")
  })
  .after.fail(e => {
    console.log("fail after", e)
  })
  .after.success(() => {
    console.log("success after")
  })
  .debug.delay(3000)
  .abort(() => {
    if (Math.random() > 0.5) {
      console.log("abort")
      return true
    }
  })