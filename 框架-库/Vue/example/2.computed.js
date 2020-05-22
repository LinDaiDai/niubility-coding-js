// 1. 调用 initComputed() 方法进行初始化
function initComputed (vm, computed) {
  const watchers = vm._computedWatchers = Object.create(null)
  for (const key in computed) {
    const userDef = computed[key]
    watchers[key] = new Watcher(
      vm,
      getter || noop, // 一个求值函数, 结果为sum的值
      noop, // 回调函数, noop 表示无操作
      { lazy: true } // 标记此 Watcher 为 ComputedWatcher
    )
    defineComputed(vm, key, userDef)
  }
}
// 2. Watcher 类(伪代码)
class Watcher {
  constructor (vm, expOrFn, cb, options) {
    this.vm = vm
    this.getter = expOrFn
    this.cb = cb
    this.lazy = !!options.lazy
    this.dirty = !!options.lazy
    this.deps = []
    this.value = undefined
  }
}
// 3. defineComputed() 重写ComputedWatcher的get和set