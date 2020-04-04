import { print } from './print'
import './styles/style.css';
import './styles/style.less';
var fileHtml = require("html-loader?attrs=img:src!./assets/file.html")

function component() {
    var element = document.createElement('div');
    element.innerHTML = 'webpack loader';

    element.classList.add('box');

    var btn = document.createElement('button');
    btn.innerHTML = '点击获取环境变量';
    btn.onclick = print;
    element.appendChild(btn);

    const fn = () => 1; // ES6箭头函数
    console.log(fn())
    let num = 3 ** 2; // ES7求幂运算符
    console.log(num)

    return element;
}

document.body.appendChild(component());
console.log(fileHtml)
    // document.body.appendChild(fileHtml)