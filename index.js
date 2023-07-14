const path = require('path')
const electron = require('electron')
const { copyPixivTags } = require('./util')

const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            webSecurity: false
        }
    })

    mainWindow.loadURL('https://www.pixiv.net/')
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // const secondaryWindow = new BrowserWindow({
    //     width: 800,
    //     height: 600
    // })

    // secondaryWindow.loadURL('file:///index.html')
    // secondaryWindow.on('closed', function () {
    //     secondaryWindow = null
    // })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});


const template = [
    {
        label: 'Reload',
        click() {
            mainWindow.reload()
        }
    },
    {
        label: 'Copy Pixiv Tags',
        click() {
            mainWindow.webContents.send('copyPixivTags')
        }
    },
    {
        label: 'Dev Tools',
        click() {
            mainWindow.webContents.openDevTools()
        }
    },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
