// Expose Electron API to renderer process
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    getInvalidURLs: require('../tools/getInvalidURLs')
})
