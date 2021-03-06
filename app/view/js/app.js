const { ipcRenderer } = require('electron');
angular
  .module('app', [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'material.svgAssetsCache',
    'btford.socket-io'
  ]).controller('AppCtrl', ['$scope', '$rootScope', AppCtrl])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,
    $urlRouterProvider) {
    $stateProvider
      .state('all-issues', {
        url: '/all-issues',
        templateUrl: 'views/all-issues.html',
        controller: 'AllIssuesController'
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('login-logout', {
        url: '/login-logout',
        templateUrl: 'views/login-logout.html',
        controller: 'AuthController'
      })
      .state('my-issues', {
        url: '/my-issues',
        templateUrl: 'views/my-issues.html',
        controller: 'MyIssuesController'
      });
    /*.state('sign-up', {
      url: '/sign-up',
      templateUrl: 'views/sign-up-form.html',
      controller: 'SignUpController',
    })
    .state('sign-up-success', {
      url: '/sign-up/success',
      templateUrl: 'views/sign-up-success.html'
    });*/
    $urlRouterProvider.otherwise('login-logout');
  }])
  .run(['$rootScope', '$state', function ($rootScope, $state) {

    $rootScope.$on('$stateChangeStart', function (event, next) {
      // redirect to login page if not logged in
      if (!$rootScope.currentUser) {
        event.preventDefault(); //prevent current page from loading
        $state.go('login-logout');
      }
    });
  }])
  .factory('socket', function (socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://192.168.1.59:3000')
    });
  });

function AppCtrl($scope, $rootScope) {
  $rootScope.currentNavItem = 'login-logout';
  $scope.closeWindow = () => {
    ipcRenderer.send('window:close');
  };
}