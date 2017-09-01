angular
  .module('app')
  .factory('AuthService', ['$q', '$rootScope', function ($q,
    $rootScope) {
    function login() {
      return new Promise((resolve, reject) => {
        ipcRenderer.send('auth:login', '');
        ipcRenderer.on('auth:login', (e, args) => {
          resolve(args);
        });
      });
    }

    function logout() {
      return new Promise((resolve, reject) => {
        ipcRenderer.send('auth:logout', '');
        resolve();
      });
    }

    return {
      login: login,
      logout: logout
    };
  }]);
