angular
  .module('app')
  .factory('IssuesService', ['$q', '$rootScope', '$http', function ($q,
    $rootScope, $http) {

    function getAllIssues() {
      return new Promise((resolve, reject) => {
        $http({
          method: 'GET',
          url: `${$rootScope.urlApi}issues?state=opened&scope=all&access_token=${$rootScope.currentUser.access_token}`
        }).then(function successCallback(response) {
          const issues = response.data;
          issues.forEach(function (issue) {
            $http({
              method: 'GET',
              url: `${$rootScope.urlApi}projects/${issue.project_id}?access_token=${$rootScope.currentUser.access_token}`
            }).then(function successCallback(response) {
              const { name_with_namespace } = response.data;
              Object.assign(issue, { project_name: name_with_namespace, formatedTime: '' });
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
    }

    function assignIssue(issue) {
      return new Promise((resolve, reject) => {
        $http({
          method: 'PUT',
          url: `${$rootScope.urlApi}projects/${issue.project_id}/issues/${issue.iid}?assignee_ids=${$rootScope.currentUser.id}&access_token=${$rootScope.currentUser.access_token}`
        }).then(function successCallback(response) {
          resolve(response);
        }, function errorCallback(response) {
          console.log(response);
          reject({ error: response });
        });

      });
    }

    function getMyIssues(state) {
      return new Promise((resolve, reject) => {
        $http({
          method: 'GET',
          url: `${$rootScope.urlApi}issues?assignee_id=${$rootScope.currentUser.id}&state=${state}&scope=all&access_token=${$rootScope.currentUser.access_token}`
        }).then(function successCallback(response) {
          const issues = response.data;
          issues.forEach(function (issue) {
            $http({
              method: 'GET',
              url: `${$rootScope.urlApi}projects/${issue.project_id}?access_token=${$rootScope.currentUser.access_token}`
            }).then(function successCallback(response) {
              const { name_with_namespace } = response.data;
              Object.assign(issue, { project_name: name_with_namespace, formatedTime: '' });
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
      setTimeSpended: setTimeSpended,
      getAllIssues: getAllIssues,
      assignIssue: assignIssue
    };

  }]);
