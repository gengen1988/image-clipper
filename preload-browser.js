const { ipcRenderer, ipcMain } = require('electron')
const { copyPixivTags } = require('./pixiv')

console.log('preload in external web page')

ipcRenderer.on('copyPixivTags', copyPixivTags)

window.addEventListener('contextmenu', evt => {
    evt.preventDefault()
    ipcRenderer.send('show-context-menu')
})