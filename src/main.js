const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const config = require('./config');

if (config.environment === 'development' && config.hotseat === true) {
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
        //resizable: false,
        width: 190,
        height: 240,
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
    win.webContents.send('fromMain', { event: 'set-server-uri', value: config['server-uri'] });
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