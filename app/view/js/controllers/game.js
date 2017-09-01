angular
  .module('app')
  .controller('AppCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.currentNavItem = 'all-games';
  }])
  .controller('LoadoutsController', ['$scope', '$rootScope', 'Loadout', 'Champion', function ($scope, $rootScope,
    Loadout, Champion) {
    $rootScope.currentNavItem = 'loadouts';
    $scope.champions = Champion.find();
  }])
  .controller('ShowLoadoutController', ['$scope', '$rootScope', '$stateParams', 'Loadout', function ($scope, $rootScope, $stateParams, Loadout) {
    $rootScope.currentNavItem = 'loadouts';
    $scope.loadouts = Loadout.find({
      filter: {
        where: {
          championId: Number($stateParams.id)
        },
        include: [
          'champion',
          'player',
          'loadoutItem'
        ]
      }
    });
  }])
  .controller('AllGamesController', ['$scope', function ($scope) {

    $scope.getRating = function (last, first, r, index, games) {
      let valor = last ? '' : r.status ? "+" + (r.rating - games[index + 1].rating).toString() : "-" + (games[index + 1].rating - r.rating).toString();
      if (!valor) {
        valor = first ? r.status ? "+" + (r.rating - games[index - 1].rating).toString() : "-" + (games[index - 1].rating - r.rating).toString() : '';
      }
      return valor;
    }
    $scope.getAccountRating = function (last, first, r, index, games) {
      let valor = last ? '' : r.status ? "+" + (r.accountRating - games[index + 1].accountRating).toString() : "-" + (games[index + 1].accountRating - r.accountRating).toString();
      if (!valor) {
        valor = first ? r.status ? "+" + (r.accountRating - games[index - 1].accountRating).toString() : "-" + (games[index - 1].accountRating - r.accountRating).toString() : '';
      }
      return valor;
    }
    $scope.games = [];
  }])
  .controller('AddGameController', ['$scope', 'Champion', 'Game',
    '$state', function ($scope, Champion, Game, $state) {
      $scope.action = 'Add';
      $scope.champions = [];
      $scope.selectedChampion;
      $scope.game = {};
      $scope.game.status = true;
      $scope.isDisabled = false;
      $scope.currentNavItem = 'add-game';
      Champion
        .find()
        .$promise
        .then(function (champions) {
          $scope.champions = champions;
          $scope.selectedChampion = $scope.selectedChampion || champions[0];
        });

      $scope.submitForm = function () {
        Game
          .create({
            rating: $scope.game.rating,
            comments: $scope.game.comments,
            accountRating: $scope.game.accountRating,
            championId: $scope.selectedChampion.id,
            status: $scope.game.status
          })
          .$promise
          .then(function () {
            $state.go('all-games');
          });
      };
    }])
  .controller('DeleteGameController', ['$scope', 'Game', '$state',
    '$stateParams', function ($scope, Game, $state, $stateParams) {
      Game
        .deleteById({ id: $stateParams.id })
        .$promise
        .then(function () {
          $state.go('my-games');
        });
    }])
  .controller('EditGameController', ['$scope', '$q', 'Champion', 'Game',
    '$stateParams', '$state', function ($scope, $q, Champion, Game,
      $stateParams, $state) {
      $scope.action = 'Edit';
      $scope.champions = [];
      $scope.selectedChampion;
      $scope.game = {};
      $scope.isDisabled = true;
      $scope.currentNavItem = 'add-games';

      $q
        .all([
          Champion.find().$promise,
          Game.findById({ id: $stateParams.id }).$promise
        ])
        .then(function (data) {
          var champions = $scope.champions = data[0];
          $scope.game = data[1];
          $scope.selectedChampion;

          var selectedChampionIndex = champions
            .map(function (champion) {
              return champion.id;
            })
            .indexOf($scope.game.championId);
          $scope.selectedChampion = champions[selectedChampionIndex];
        });

      $scope.submitForm = function () {
        $scope.game.championId = $scope.selectedChampion.id;
        $scope.game
          .$save()
          .then(function (game) {
            $state.go('all-games');
          });
      };
    }])
  .controller('MyGamesController', ['$scope', 'Game', '$rootScope',
    function ($scope, Game, $rootScope) {
      $rootScope.currentNavItem = 'my-games';
      $scope.games = Game.find({
        filter: {
          where: {
            publisherId: $rootScope.currentUser.id
          },
          include: [
            'champion',
            'player'
          ]
        }
      });

      $scope.getRating = function (last, first, r, index, games) {
        let valor = last ? '' : r.status ? "Win +" + (r.rating - games[index + 1].rating).toString() : "Loss -" + (games[index + 1].rating - r.rating).toString();
        if (!valor) {
          valor = first ? r.status ? "Win +" + (r.rating - games[index - 1].rating).toString() : "Loss -" + (games[index - 1].rating - r.rating).toString() : '';
        }
        return valor;
      }
    }]);
