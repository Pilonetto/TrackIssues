angular
  .module('app')
  .factory('IssuesService', ['$q', '$rootScope', '$http', function ($q,
    $rootScope, $http) {

    function getMyIssues(state) {
      return new Promise((resolve, reject) => {
        $http({
          method: 'GET',
          url: `${$rootScope.urlApi}issues?assignee_id=${$rootScope.currentUser.id}&state=${state}&access_token=${$rootScope.currentUser.access_token}`
        }).then(function successCallback(response) {
          const issues = response.data;
          issues.forEach(function (issue) {
            $http({
              method: 'GET',
              url: `${$rootScope.urlApi}projects/${issue.project_id}?access_token=${$rootScope.currentUser.access_token}`
            }).then(function successCallback(response) {
              const { name } = response.data;
              Object.assign(issue, { project_name: name, formatedTime: '' });
            }, function errorCallback(response) {
              console.log(response);
              reject({ error: response });
            });
          }, resolve(issues));
        }, function errorCallback(response) {
          console.log(response);
          reject({ error: response });
        });

      });
    };

    function setTimeSpended(issue) {
      return new Promise((resolve, reject) => {
        $http({
          method: 'POST',
          url: `${$rootScope.urlApi}projects/${issue.project_id}/issues/${issue.iid}/add_spent_time?duration=${issue.formatedTime}&access_token=${$rootScope.currentUser.access_token}`
        }).then(function successCallback(response) {

          resolve(response.data);
        }, function errorCallback(response) {
          console.log(response);
          reject({ error: response });
        });

      });
    }

    return {
      getMyIssues: getMyIssues,
      setTimeSpended: setTimeSpended
    };

  }]);
