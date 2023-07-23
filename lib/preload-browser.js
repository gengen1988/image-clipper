const { ipcRenderer } = require('electron')
const Router = require('./router')

console.log('preload in external web page')

const router = new Router()
router.register(require('../processors/pixiv'))
router.register(require('../processors/yandere'))

ipcRenderer.on('save-image', evt => {
    router.saveImage()
})

window.addEventListener('DOMContentLoaded', evt => {
    var url = new URL(window.location.href)
    router.updateURL(url)
})

window.addEventListener('contextmenu', evt => {
    evt.preventDefault()
    if (!router.validate(evt.target)) {
        return
    }
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



// var thumbnailSet = new Set()
// const observer = new MutationObserver(() => {
//     const thumbnails = selectThumbnails()

//     thumbnails.forEach(node => {
//         if (thumbnailSet.has(node)) {
//             return
//         }

//         augumentThumbnail(node)
//     })

//     thumbnailSet = new Set(thumbnails)
// })
// observer.observe(document.body, { childList: true, subtree: true })

// function selectThumbnails() {
//     return [...document.querySelectorAll('div[type=illust]')]
// }

// function augumentThumbnail(node) {
//     const label = document.createElement('div')
//     label.style.position = 'absolute'
//     label.style.top = '0'
//     label.style.right = '0'
//     label.style.zIndex = '9999'
//     label.textContent = 'label'

//     node.appendChild(label)
// }