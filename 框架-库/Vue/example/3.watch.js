// $watch
Vue.prototype.$watch = function (expOrFn, cb, options?) {
  const vm = this
  options.user = true
  const watcher = new Watcher(vm, expOrFn, cb, options)
  return function unwatchFn () {
    watcher.teardown()
  }
}
// Watcher
class Watcher {
  constructor (vm, expOrFn, cb, options) {
    this.vm = vm
    this.getter = expOrFn
    this.cb = cb
    this.user = !!options.user
  }

}