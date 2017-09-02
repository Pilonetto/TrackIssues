const electron = require('electron');
const { app, BrowserWindow, session, ipcMain } = electron;
const path = require('path');
const Auth = require('./src/auth');
require('dotenv').config();

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(`file://${__dirname}/view/index.html`);
  const auth = new Auth();

  ipcMain.on('auth:login', (e, args) => {
    auth.login().then((currentUser) => {
      mainWindow.webContents.send('auth:login', currentUser);
    }, (err) => {
      console.error(err.error);
    });
  });

  ipcMain.on('get:urlApi', (e, args) => {
    mainWindow.webContents.send('get:urlApi', process.env.URL_API);
  });

  ipcMain.on('auth:logout', (e, args) => {
    auth.logout();
  });

});