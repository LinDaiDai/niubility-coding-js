// 一、初始化Vue构造函数时伪代码
// 1. 给 Vue.prototype上添加方法
// 文件位置： src/core/instance/index.js
function Vue (options) {
  this._init(options)
}
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
export default Vue

// 2. 给 Vue 构造函数上添加静态方法
// 文件位置： src/core/index.js
initGlobalAPI(Vue)


// 二、 new Vue()实例对象时伪代码, 也就是执行_init()方法
// 文件位置：src/core/instance/init.js
function _init (options) {
  const vm = this
  vm.$options = mergeOptions()
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm)
  initState(vm)
  initProvide(vm)
  callHook(vm, 'created')
}

// 三、响应式数据原理-依赖收集
// 1. _init() 中执行 initState()
initState(vm)
// 2. initState() 中执行 initData()
initData(vm)
// 3. initData() 中将数据添加到观察者中
observe(data, true /* asRootData */)
// 4. observe() 中返回的是一个 Observer
function observe(value, asRootData) {
  return new Observer(value)
}
// 5. new Observer() 会对对象的每个属性进行劫持
class Observer {
  constructor (value) {
    this.walk(value)
  }
  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, key[i])
    }
  }
}
// 6. defineReactive() 方法进行依赖收集(伪代码)
function defineReactive (obj, key) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      dep.depend()
    },
    set: function reactiveSetter (newVal) {
      dep.notify()
    }
  })
}
// 7. Dep 类伪代码
class Dep {
  constructor () {
    this.id = uid++
    this.subs = []
  }
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  notify () {
    const subs = this.subs.slice()
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }
}
// 8. Watcher 类(伪代码)
class Watcher {
  addDep (dep: Dep) {
    dep.addSub(this)
  }
  update () {
    if (this.lazy) { // 计算属性
      this.dirty = true // 为 true 时重新计算
    } else if (this.sync) { // 同步的 watcher
      this.run()
    } else {
      queueWatcher(this)
    }
  }
}
// 9. queueWatcher() 方法将 watcher放到队列中批量更新
const queue: Array<Watcher> = []
function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  // 过滤 watcher, 多个属性可能会依赖同一个 watcher
  if (has[id] == null) {
    has[id] = true
    queue.push(watcher)
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
// 10. flushSchedulerQueue 方法运行队列中的每个 watcher.run()
function flushSchedulerQueue () {
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
  }
  waiting = flushing = false
}
// 11. nextTick() 方法批量异步更新
const callbacks = []
function nextTick (cb?: function, ctx?: Object) {
  callbacks.push(() => {
    cb.call(ctx)
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
}
// 12. timerFunc() 达到异步的效果
let timerFunc
// 一、浏览器是否支持 Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
// 二、再考虑 MutationObserver, 当然这里判断条件是简写
// 实际还要做一些兼容性的判断
} else if (MutationObserver !== 'undefined') {
  // timerFunc 用 MutationObserver 来实现
// 三、再考虑 setImmediate
} else if (typeof setImmediate !== 'undefined') {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
// 四、最后考虑 setTimeout
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
// 13. flushCallbacks() 执行每一个 callback
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
