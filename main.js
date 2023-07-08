const { app, BrowserWindow } = require('electron');
const remoteMain = require('@electron/remote/main');
let path = require('path');
remoteMain.initialize();

const createWindow = () => {
    const win = new BrowserWindow({
        show: false,
        //titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.maximize();
    win.loadFile("index.html");
    remoteMain.enable(win.webContents);
}

app.whenReady().then(() => {
    createWindow();
});

// Close app when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
    });