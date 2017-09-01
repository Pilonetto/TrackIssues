angular
  .module('app')
  .controller('AuthController', ['$scope', 'AuthService', '$state', '$rootScope',
    function ($scope, AuthService, $state, $rootScope) {
      $scope.currentNavItem = 'login-logout';

      $scope.login = function () {
        AuthService.login()
          .then((res) => {
            $rootScope.currentUser = {};
            $rootScope.currentUser.token = res.access_token;
            $state.go('my-issues');
          });
      };
      $scope.logout = function () {
        AuthService.logout()
          .then(function () {
            $rootScope.currentUser = null;
          });
      };

    }]);