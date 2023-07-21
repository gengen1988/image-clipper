const path = require('path')
const electron = require('electron')

const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

let managerWindow

function createWindow() {
    managerWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload-manager.js'),
            nodeIntegration: true,
        }
    })

    managerWindow.on('closed', () => {
        managerWindow = null
    })

    managerWindow.loadFile('index.html')
}

app.on('ready', createWindow)

// darwin
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// darwin
app.on('activate', evt => {
    if (managerWindow === null) {
        createWindow()
    }
})

app.on('web-contents-created', (evt, webContents) => {
    webContents.setWindowOpenHandler(() => {
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                webPreferences: {
                    preload: path.join(__dirname, 'preload-browser.js'),
                    nodeIntegration: true,
                    webSecurity: false
                }
            }
        }
    })
})

ipcMain.on('show-context-menu', evt => {
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Copy Pixiv Tags',
            click() {
                var window = BrowserWindow.getFocusedWindow()
                window.webContents.send('copyPixivTags')
            }
        },
    ])
    contextMenu.popup()
})
