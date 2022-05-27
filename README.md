# WRequest

Promise Wrap

## 安装

```
$ npm install git+https://github.com/gityoog/wrequest.git --save
```

## 使用

```ts
// 1.创建实例
const request = new WRequest(() => promise);

// 2.链式回调(支持异步/同步回调)
request
  .load(() => {
    // 运行中回调
  })
  .abort((result) => {
    // @param result: 被包装Promise的运行结果
    // @return boolean|void: 返回true可以中断load以外的回调调用(常用于重复请求判断等)
  })
  .success((data) => {
    // 成功回调(以注册的正序顺序运行)
    // @param T: 成功返回值
  })
  .validate((data) => {
    // @param T: 成功返回值
    // @return boolean|string: 返回true|string可停止后续成功回调进入错误处理
  })
  .transform((data) => {
    // @param T: 成功返回值
    // @return RT: 返回新值传递后续成功回调, 抛出错误可停止后续成功回调进入错误处理
  })
  .map((data) => {
    // transform 别名
  })
  .fail((error) => {
    // @param string: 上层错误提示
    // @return string|void: 错误回调以注册逆序运行 如无返回 将停止后续错误回调运行
  })
  .final(() => {
    // 结束回调
  })
  .after.success(() => {
    // 成功回调后的回调
  })
  .after.fail((error) => {
    // 失败回调后的回调
  })
  .promise() // to promise
  .debug.delay() // 调试专用 增加延时(默认: 1000ms)
  .debug.success(data) // 调试专用 直接使用成功Promise运行
  .debug.fail(data); // 调试专用 直接使用失败Promise运行
```
