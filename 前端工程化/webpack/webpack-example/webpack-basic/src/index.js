import _ from 'lodash'
import './style.css'
import { cube } from './math'
// import * as lindaiWebpackNumbers from 'lindaidai-webpack-numbers'
var lindaiWebpackNumbers = require('lindaidai-webpack-numbers')
    // import Icon from './icon.png'

function component() {
    var element = document.createElement('div');

    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.innerHTML = '孔子曰：中午不睡，下午崩溃!孟子曰：孔子说的对!';
    element.classList.add('color_red')

    // var img = new Image();
    // img.src = Icon;
    // element.appendChild(img);
    console.log(cube(3)) // 使用了cube
    console.log(lindaiWebpackNumbers.numToWord(2))
    return element;
}

document.body.appendChild(component());