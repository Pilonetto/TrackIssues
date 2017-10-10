const moment = require('moment');
angular
  .module('app')
  .controller('MyIssuesController', ['$scope', 'IssuesService', '$state', '$rootScope', 'socket',
    function ($scope, IssuesService, $state, $rootScope, socket) {
      $rootScope.currentNavItem = 'my-issues';

      $scope.openIssue = (url) => {
        var shell = require('electron').shell;
        event.preventDefault();
        shell.openExternal(url);
      }

      $scope.getMyIssues = () => {
        IssuesService.getMyIssues('opened').then((response) => {
          $scope.myIssues = response;
        }, (reject) => {

        });
      };

      $scope.stopTimer = (i) => {
        IssuesService.setTimeSpended($scope.myIssues[i]).then((response) => {
          socket.emit('client:stopTimer', $scope.myIssues[i]);
        }, (reject) => {

        });
        clearInterval($scope.myIssues[i].timer);
      }

      $scope.startTimer = (i) => {
        $scope.myIssues[i].currentTime = 0;
        $scope.myIssues[i].timer = setInterval(() => {
          socket.emit('client:startTimer', $scope.myIssues[i]);
          $scope.myIssues[i].currentTime++;
          $scope.myIssues[i].formatedTime = secondsToTime($scope.myIssues[i].currentTime);
          $scope.$apply();
        }, 1000);
      };

      secondsToTime = (s) => {
        let momentTime = moment.duration(s, 'seconds');
        let sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds();
        let min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes();
        let hour = momentTime.hours() < 10 ? ('0' + momentTime.hours()) : momentTime.hours();

        return `${hour}h${min}m${sec}s`;
      };

      $scope.getMyIssues();
    }]);