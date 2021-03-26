const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    });
}

let win;

function createWindow() {
    win = new BrowserWindow({
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        width: 200,
        height: 250,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('src/page/index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    win.webContents.send('fromMain', { event: 'set-server-uri', value: process.env.SERVER_URI });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('toMain', (event, args) => {
    switch (args.event) {
        case 'exit':
            app.quit();
    }
});