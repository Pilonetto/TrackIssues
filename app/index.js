const electron = require('electron');
const { app, BrowserWindow, session } = electron;
const electronReload = require('electron-reload');
const electronOauth2 = require('electron-oauth2');
require('dotenv').config();

var config = {
    clientId: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    authorizationUrl: 'https://gitlab.com/oauth/authorize',
    tokenUrl: 'https://gitlab.com/oauth/token',
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

    session.defaultSession.cookies.get({ name: 'token' }, (error, cookies) => {
        if (!cookies[0]) {
            const options = {};

            const myApiOauth = electronOauth2(config, windowParams);

            myApiOauth.getAccessToken(options)
                .then(token => {
                    console.log('token: ', token.access_token);

                    session.defaultSession.cookies.set({ url: 'http://localhost', name: 'token', value: token.access_token, domain: 'localhost', expirationDate: 9999999999999 }, (error) => {
                        if (error) {
                            console.log(error);
                        }

                        session.defaultSession.cookies.get({ name: 'token' }, (error, cookies) => {
                            console.log(error, cookies)
                        })
                    });
                });
        }
    })

});