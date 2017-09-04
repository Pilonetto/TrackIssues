angular
  .module('app')
  .factory('AuthService', ['$q', '$rootScope', '$http', function ($q,
    $rootScope, $http) {
    function login() {
      return new Promise((resolve, reject) => {
        ipcRenderer.send('auth:login', '');
        ipcRenderer.on('auth:login', (e, args) => {
          ipcRenderer.send('get:urlApi', '');
          const currentUser = args;
          ipcRenderer.on('get:urlApi', (e, args) => {
            const urlApi = args;
            $http({
              method: 'GET',
              url: `${urlApi}user?access_token=${currentUser.access_token}`
            }).then(function successCallback(response) {
              const { id, username, name } = response.data;
              Object.assign(currentUser, { id, username, name, urlApi });
              resolve({ currentUser, urlApi: args });
            }, function errorCallback(response) {
              reject({ error: response });
            })

          });

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
