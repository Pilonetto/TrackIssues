angular.module('MyApp', ['satellizer'])
  .config(function ($authProvider) {

    // No additional setup required for Twitter

    $authProvider.oauth2({
      name: 'gitlab',
      url: 'api/auth/gitlab',
      clientId: '911d1f88335af16b4139a374ddc6543f75a1b00558387104b749f64a7908516d',
      responseType: 'code',
      redirectUri: 'http://localhost:3000',
      authorizationEndpoint: 'http://gitlab.com/oauth/authorize',
    });

  }).controller('LoginCtrl', function ($scope, $auth) {

    $scope.authenticate = function (provider) {
      console.log('asdasdasd');
      $auth.authenticate(provider);
    };

  });