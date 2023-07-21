const path = require('path')
const electron = require('electron')
const { copyPixivTags } = require('./pixiv')

const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

let mainWindow

const defaultWebPreferences = {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
    webSecurity: false
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: defaultWebPreferences
    })

    mainWindow.loadURL('https://www.pixiv.net/')
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('web-contents-created', (evt, webContents) => {
    webContents.setWindowOpenHandler(() => {
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                webPreferences: defaultWebPreferences
            }
        }
    })
})

const template = [
    {
        label: 'Reload',
        click() {
            var window = BrowserWindow.getFocusedWindow();
            window.reload()

        }
    },
    {
        label: 'Copy Pixiv Tags',
        click() {
            var window = BrowserWindow.getFocusedWindow();
            window.webContents.send('copyPixivTags')
        }
    },
    {
        label: 'Dev Tools',
        click() {
            var window = BrowserWindow.getFocusedWindow();
            window.webContents.toggleDevTools()
        }
    },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
