import _ from 'lodash';
import numRef from './ref.json';

export function numToWord(num) {
    return _.reduce(numRef, (accum, ref) => {
        return num === ref.num ? ref.word : accum
    })
}

export function wordToNum(word) {
    return _.reduce(numRef, (accum, ref) => {
        return ref.word === word && word.toLowerCase() ? ref.num : accum;
    }, -1);
};