import './style.css'
import './style2.css'
import Icon from './icon.png'
import printMe from './print'
function createElement () {
  const element = document.createElement('div')
  element.innerHTML = '孔子曰：中午不睡，下午崩溃!孟子曰：孔子说的对!';
  element.classList.add('color_red')

  var img = new Image(200, 200)
  img.src = Icon
  element.appendChild(img)

  var btn = document.createElement('button');
  btn.innerHTML = '点击我';
  btn.onclick = printMe;
  element.appendChild(btn);

  return element
}
document.body.appendChild(createElement())