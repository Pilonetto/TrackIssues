angular
  .module('app')
  .controller('AllIssuesController', ['$scope', 'IssuesService', '$state', '$rootScope',
    function ($scope, IssuesService, $state, $rootScope) {
      $rootScope.currentNavItem = 'all-issues';

      $scope.openIssue = (url) => {
        var shell = require('electron').shell;
        event.preventDefault();
        shell.openExternal(url);
      }

      $scope.getAllIssues = () => {
        IssuesService.getAllIssues().then((response) => {
          $scope.allIssues = response;
        }, (reject) => {

        });
      };

      $scope.assignIssue = (issue) => {
        IssuesService.assignIssue(issue).then((response) => {
          $scope.getAllIssues();
        }, (reject) => {

        });
      }

      $scope.getAllIssues();
    }]);