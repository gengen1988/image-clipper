const { ipcRenderer, ipcMain } = require('electron');
const { copyPixivTags } = require('./pixiv')

console.log('do preload')

ipcRenderer.on('copyPixivTags', copyPixivTags)
