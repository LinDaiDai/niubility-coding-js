/**
 * 代码分离-import动态导入
 */
// function getComponent() {
//     return import ( /* webpackChunkName: "custom-lodash" */ 'lodash').then(_ => {
//         var element = document.createElement('div')
//         element.innerHTML = _.join(["Hello", "LinDaiDai"])

//         return element
//     }).catch(error => 'An error occurred while loading the component')
// }

// getComponent().then(component => {
//     document.body.appendChild(component)
// })
/**
 * 代码分离-import动态导入结合async
 */
// async function getComponent() {
//     var element = document.createElement('div')
//     const _ = await
//     import ( /* webpackChunkName: "loadsh" */ 'lodash')

//     element.innerHTML = _.join(["Hello", "LinDaiDai"])
//     return element
// }
// getComponent().then(component => {
//     document.body.appendChild(component)
// })
// import _ from 'lodash'

function getComponent() {
    var element = document.createElement('div')
    element.innerHTML = 'Hello LinDaiDai'

    var btn = document.createElement('button')
    btn.innerHTML = '点击按钮'
    element.appendChild(btn)
        // btn.onclick = e =>
        //     import ( /* webpackChunkName: "lodash" */ "lodash").then(_ => {
        //         console.log(_.join(['点击了按钮', '加载了lodash']))
        //     })
    btn.onclick = e =>
        import ( /* webpackChunkName: "print" */ "./print").then(module => {
            var print = module.default
            print()
        })

    return element
}
document.body.appendChild(getComponent())