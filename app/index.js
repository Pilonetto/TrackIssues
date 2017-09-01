const electron = require('electron');
const { app, BrowserWindow, session, ipcMain } = electron;
const path = require('path')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});
const electronOauth2 = require('electron-oauth2');
require('dotenv').config();

var config = {
  clientId: process.env.APP_ID,
  clientSecret: process.env.APP_SECRET,
  authorizationUrl: process.env.URL_AUTH,
  tokenUrl: process.env.URL_TOKEN,
  useBasicAuthorizationHeader: false,
  redirectUri: 'http://localhost'
};

let mainWindow;


app.on('ready', () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(`file://${__dirname}/view/index.html`);

  const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false
    }
  };


  ipcMain.on('auth:login', (data) => {
    session.defaultSession.cookies.get({ name: 'token' }, (error, cookies) => {
      if (!cookies[0]) {
        const options = {};
        const myApiOauth = electronOauth2(config, windowParams);

        myApiOauth.getAccessToken(options)
          .then(token => {
            if (token.access_token) {
              mainWindow.webContents.send('auth:login', token);
              session.defaultSession.cookies.set({ url: 'http://localhost', name: 'token', value: token.access_token, domain: 'localhost', expirationDate: 9999999999999 }, (error) => {
                if (error)
                  console.error(error);
                session.defaultSession.cookies.get({ name: 'token' }, (error, cookies) => {
                  if (error)
                    console.error(error);
                })
              });
            } else {
              mainWindow.webContents.send('auth:login', { error: 'The login failed!' });
            }
          });
      } else {
        mainWindow.webContents.send('auth:login', { access_token: cookies[0].token });
      };
    });
  });

});