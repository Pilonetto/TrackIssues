angular
  .module('app')
  .controller('AuthController', ['$scope', 'AuthService', '$state', '$rootScope',
    function ($scope, AuthService, $state, $rootScope) {
      $rootScope.currentNavItem = 'login-logout';

      $scope.login = () => {
        AuthService.login()
          .then((res) => {
            if (!res.error) {
              $rootScope.currentUser = res.currentUser;
              $rootScope.urlApi = res.urlApi;
              $state.go('my-issues');
            }
          });
      };
      $scope.logout = () => {
        AuthService.logout()
          .then(function () {
            $rootScope.currentUser = null;
          });
      };

    }]);