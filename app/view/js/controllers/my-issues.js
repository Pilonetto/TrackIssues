angular
  .module('app')
  .controller('MyIssuesController', ['$scope', 'MyIssuesService', '$state', '$rootScope',
    function ($scope, MyIssuesService, $state, $rootScope) {
      $scope.currentNavItem = 'my-issues';

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