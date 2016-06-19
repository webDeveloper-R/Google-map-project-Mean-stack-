'use strict';
angular.module('lassoo', ['ui.router'])
.config(function ($stateProvider, $urlRouterProvider) {    
    $urlRouterProvider.otherwise('login');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/lassoMap.html',
        controller: 'HomeCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthCtrl'
      });
  });
