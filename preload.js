const { ipcRenderer } = require('electron');
const { copyPixivTags } = require('./util')

ipcRenderer.on('copyPixivTags', copyPixivTags)