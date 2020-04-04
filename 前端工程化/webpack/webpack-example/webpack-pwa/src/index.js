// function registerSW() {
//     if ('serviceWorker' in navigator) {
//         window.addEventListener('load', () => {
//             navigator.serviceWorker.register('/service-worker.js').then(registragion => {
//                 console.log('SW registered: ', registragion)
//             }).catch(registrationError => {
//                 console.log('SW registration failed: ', registrationError);
//             })
//         })
//     }
// }

// registerSW()
function component() {
    var element = document.createElement('div')
    element.innerHTML = 'PWA'

    return element;
}
document.body.appendChild(component())
console.log(navigator)
console.log('serviceWorker' in navigator)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('进来')
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}