'use strict';

angular.module('proyectXApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    // $scope.menu = [{
    //   'title': 'PS4',
    //   'link': '/'
    // },
    // {
    //   'title': 'XBOX One',
    //   'link': '/'
    // },
    // {
    //   'title': 'Steam',
    //   'link': '/'
    // }];

    $scope.isCollapsed = true;

    $scope.collapsed = function() {
      angular.element('.cmn-toggle-switch').toggleClass('active');
    }

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
