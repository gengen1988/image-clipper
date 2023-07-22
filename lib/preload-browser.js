const { ipcRenderer, ipcMain } = require('electron')
const Router = require('./router')

console.log('preload in external web page')

const router = new Router()
router.register(require('../src/pixiv'))
router.register(require('../src/yandere'))

ipcRenderer.on('save-image', evt => {
    var url = new URL(window.location.href)
    router.saveImage(url)
})

window.addEventListener('contextmenu', evt => {
    evt.preventDefault()
    ipcRenderer.send('show-context-menu')
})

// window.addEventListener('DOMContentLoaded', () => {
//     // Code to be executed after the page has loaded
//     var el = document.querySelector('main nav > div[style]')
//     console.log(el)
// });

// const observed = () => {
//     const links = document.querySelectorAll('main nav > div[style]')
//     console.log(links)
// }
// const observer = new MutationObserver(observed);
// observer.observe(document.body, { childList: true, subtree: true })
