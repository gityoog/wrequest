import WRequest from '../dist'

new WRequest(() => new Promise((resolve, reject) => {
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
  .success(a => {
    console.log("success", a)
  })
  .fail(e => {
    console.log("fail", e)
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
  .abort(() => {
    if (Math.random() > 0.5) {
      console.log("abort")
      return true
    }
  })