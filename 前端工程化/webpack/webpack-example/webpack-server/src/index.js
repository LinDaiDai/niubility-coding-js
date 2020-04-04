import './style.css';
import printMe from './print.js';

function component() {
    var element = document.createElement('div');
    element.classList.add('box');
    element.innerHTML = 'Hello Webpack';

    var btn = document.createElement('button');
    btn.innerHTML = '点击我';
    btn.onclick = printMe;
    element.appendChild(btn);

    return element;
}

document.body.appendChild(component());