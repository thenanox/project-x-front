'use strict';

angular.module('proyectXApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.cards = [];

    $http.get('/api/cards').success(function(response) {
      $scope.cards = response;
    });

  });
