const electronOauth2 = require('electron-oauth2');
const Store = require('./store');

require('dotenv').config();

const store = new Store({
    configName: 'current-user',
    defaults: {
        currentUser: {}
    }
});

class Auth {
    constructor() {
        this.config = {
            clientId: process.env.APP_ID,
            clientSecret: process.env.APP_SECRET,
            authorizationUrl: process.env.URL_AUTH,
            tokenUrl: process.env.URL_TOKEN,
            useBasicAuthorizationHeader: false,
            redirectUri: 'http://localhost'
        };

        this.windowParams = {
            alwaysOnTop: true,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: false
            }
        };

        this.currentUser = store.get('currentUser') || {};
    }

    login() {
        const that = this;
        return new Promise((resolve, reject) => {
            if (Object.keys(that.currentUser).length === 0) {
                const options = {};
                const myApiOauth = electronOauth2(that.config, that.windowParams);

                myApiOauth.getAccessToken(options)
                    .then(token => {
                        if ((token) && (token.access_token)) {
                            that.currentUser = token;
                            store.set('currentUser', that.currentUser);
                            resolve(that.currentUser);
                        } else {
                            reject({ error: 'The login failed!' });
                        }
                    });
            } else {
                resolve(that.currentUser);
            }
        })
    }

    logout() {
        this.currentUser = {};
        store.set('currentUser', {});
    }

}

module.exports = Auth;