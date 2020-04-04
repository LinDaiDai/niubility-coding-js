import './style.css';
import { cube } from './math';

function component() {
    var element = document.createElement('div');
    element.innerHTML = 'hello dd';
    element.classList.add('box')
    console.log(cube(3))
    return element;
}

document.body.appendChild(component());