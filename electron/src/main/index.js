'use strict'

import { app, BrowserWindow } from 'electron'
import '../renderer/store/index'
const electron = require('electron')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const Menu = electron.Menu
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

function createWindow () {
    Menu.setApplicationMenu(null)
    mainWindow = new BrowserWindow({
        height: 940,
        width: 1920,
        useContentSize: true,
        icon: './icon.ico',
        title: '裕丰科技地理数据处理系统',
        titleBarStyle: 'hiddenInset',
        fullscreen: false,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            plugins: true
        }
    })

    mainWindow.loadURL(winURL)
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
