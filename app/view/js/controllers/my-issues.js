angular
  .module('app')
  .controller('MyIssuesController', ['$scope', 'MyIssuesService', '$state', '$rootScope',
    function ($scope, MyIssuesService, $state, $rootScope) {
      $scope.currentNavItem = 'my-issues';

      $scope.getIssues = () => {

      };

    }]);