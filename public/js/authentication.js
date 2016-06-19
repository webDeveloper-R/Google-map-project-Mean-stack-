'use strict';
angular.module('lassoo')
.controller('AuthCtrl', ['$scope', '$state', 'auth', '$window', function($scope, $state, auth, $window){
    $scope.user = {};
    $scope.confirmPass = null;
    $scope.register = function(){
        if($scope.user.password != $scope.confirmPass){
            return $window.alert("Password does not match !");
        }
        auth.register($scope.user).error(function(error){
            $window.alert("The username is existing !");
        }).then(function(){
            $state.go('home');
        });
    };

    $scope.logIn = function(){
        auth.logIn($scope.user).error(function(error){
            $window.alert(error.message);
        }).then(function(){
            $state.go('home');
        });
    };

    $scope.goReg = function(){
        $state.go('register');
    };
}]);