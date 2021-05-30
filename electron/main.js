const { app, BrowserWindow } = require('electron')
const DownloadManager = require("electron-download-manager")
const server = require('./server');

const DEV = false;
global.DEV = DEV;

const port = DEV ? 8080 : 8083;

let win

function createWindow() {
  win = new BrowserWindow({
    width: 800, height: 600, 'min-width': 1000, 'min-height': 600, webPreferences: {
      nodeIntegration: true
    }, show: false
  });
  win.setMenu(null);

  win.loadURL(`http://localhost:${port}/`)

  win.webContents.on('did-finish-load', function () {
    win.maximize();
    win.setMinimumSize(1000, 600);
    win.show();
  });

  if (DEV) win.webContents.openDevTools()


  win.on('closed', () => {
    win = null;
    app.quit();
  })
}

function init() {
  DownloadManager.register({ downloadFolder: app.getPath("desktop") + "/APOS-Reports" })
  if (DEV) {
    createWindow();
  } else {
    server.listen(port, function () {
      console.log('%s listening at %s', server.name, server.url);
      createWindow();
    });
  }
}

app.on('ready', init)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})