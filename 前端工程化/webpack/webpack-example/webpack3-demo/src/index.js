import _ from 'lodash'
import { print } from './another-module'

function component() {
    var element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    print();

    return element;
}

document.body.appendChild(component());