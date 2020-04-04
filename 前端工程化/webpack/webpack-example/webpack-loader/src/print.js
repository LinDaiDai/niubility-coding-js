import txt from './assets/file.txt'
import img from './assets/file.png' // < 40KB data:image/png;base64
// import wpl from './assets/wpl.png' // > 40KB 0565680d883d2c278e70d23f5ee97975.png
const wpl = require('./assets/wpl.png') // > 40KB 0565680d883d2c278e70d23f5ee97975.png
    // const svg = require('./assets/add-icon.svg')
import svg from './assets/add-icon.svg'
import { numToWord } from './assets/test.ts'
export function print() {
    console.log(txt)
    console.log(img)
    console.log(wpl)
    console.log(svg)

    var imgEle = new Image()
    var wplEle = new Image()
    var svgEle = new Image()
    imgEle.src = img
    wplEle.src = wpl
    svgEle.src = svg
    document.body.appendChild(imgEle)
    document.body.appendChild(wplEle)
    document.body.appendChild(svgEle)
    console.log(numToWord(2))

    console.log('print')
}