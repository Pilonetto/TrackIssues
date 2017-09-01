angular
  .module('app')
  .factory('MyIssuesService', ['$q', '$rootScope', function ($q,
    $rootScope) {
    function getIssues() {

    };
    /*  function login() {
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
        });
      }
  */
    return {
      getIssues: getIssues
    };

  }]);
