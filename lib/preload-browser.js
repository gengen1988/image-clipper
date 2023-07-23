const { ipcRenderer } = require('electron')
const Router = require('./router')

console.log('preload in external web page')

const router = new Router()
router.register(require('../processors/pixiv'))
router.register(require('../processors/yandere'))

window.addEventListener('DOMContentLoaded', evt => {
    var url = new URL(window.location.href)
    router.updateURL(url)
})

window.addEventListener('contextmenu', evt => {
    evt.preventDefault()
    if (!router.validate(evt.target)) {
        return
    }

    router.saveImage()
})
