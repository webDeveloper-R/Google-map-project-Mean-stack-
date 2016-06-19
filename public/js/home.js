'use strict';
angular.module('lassoo')
.controller('HomeCtrl', ['$scope', '$state', 'auth', '$window', '$http', function($scope, $state, auth, $window, $http){

    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
    if(!auth.isLoggedIn()){        
        return $state.go('login');
    }

    var location = null,
        map = null,
        mapOptions = null,
        directionsDisplay = [],
        waypoints = [],
        routeColor = ['blue', 'purple', 'red', 'green', 'gray', 'black', 'pink', 'yellow'],
        pointsCount = 7,
        requiredDistance,
        origin = {lat: 51.513878, lng: -0.111044};
/*
    var s = document.createElement('script');
    s.src = '//maps.googleapis.com/maps/api/js?sensor=false&language=en&callback=initMap';
    document.body.appendChild(s);*/
    $window.initMap = function() {
      /*$.getJSON('http://api.wipmania.com/jsonp?callback=?', function (data) { 
        origin.lat=data.latitude;
        origin.lng=data.longitude;
        console.log(origin);
        initializeMap();
      });*/
      initializeMap();
    };

    $scope.setDistance = 5;
    $scope.showMode = 0;
    var selectedMode = 'WALKING';
    $scope.setMode0=function(){
      $scope.showMode = 0;
      $scope.setDistance = 5;
      selectedMode = 'WALKING';
      $scope.styleMode0 = {color: '#0b9597'};
      $scope.styleMode1 = {color: 'white'};
    };
    $scope.setMode1=function(){
      $scope.showMode = 1;
      $scope.setDistance = 50;
      selectedMode = 'BICYCLING';
      $scope.styleMode1 = {color: '#0b9597'};
      $scope.styleMode0 = {color: 'white'};
    };
    $scope.viewMap=function(){
      initializeMap();
    };
    $scope.makingKML=function(){
      $http.post('/exportKML', 'export').success(function(data){
          $window.alert("success!");
      }).error(function(data){
        $window.alert(data);
      });
    };
    function initializeMap() {
      location = new google.maps.LatLng(origin.lat, origin.lng);
      mapOptions = {
        zoom: 4,
        center: location
      };
      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      requiredDistance = $scope.setDistance *1000/3;
      makeWaypoints(origin, requiredDistance, pointsCount);
      //waypoints[0]= [{location: {lat: 51.515247, lng: -0.111560}},{location: {lat: 51.518249, lng: -0.113820}},{location: {lat: 51.513878, lng: -0.111044}},{location: {lat: 51.517636, lng: -0.120375}},{location: {lat: 51.513226, lng: -0.117310}},{location: {lat: 51.513103, lng: -0.114973}},{location: {lat: 51.513878, lng: -0.111044}}];
      for(var i=0; i<3; i++){
        displayRoute(map, routeColor[i], origin, origin, waypoints[i], selectedMode);
      }
      
      var originMarker = new google.maps.Marker({
          position: location,
          map: map
      });
    }
    function displayRoute(map, routeColor, origin, destination, waypoints, selectedMode) {
        var display = new google.maps.DirectionsRenderer({
              draggable: true,
              map: map,
              polylineOptions: {
                strokeColor: routeColor
              }
        });
        var service = new google.maps.DirectionsService();
        display.addListener('directions_changed', function() {
              computeTotalDistance(display.getDirections());
        });
        service.route({
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: google.maps.TravelMode[selectedMode],
          avoidTolls: true
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            display.setDirections(response);
            display.setMap(map);
            display.setOptions( { suppressMarkers: true } );
          } else {
            alert('Could not display directions due to: ' + status);
          }
        });
    }
    function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        console.log(total);
        //document.getElementById('total').innerHTML = total + ' km';
    }
    function makeWaypoints(origin, requiredDistance, pointsCount){
      var dx, dy, deltaLng, deltaLat, coord = {}, angle1 = 0, angle2 = 0;
      var distance = 1.2*requiredDistance/(pointsCount-1);
      coord.lng = origin.lng;
      coord.lat = origin.lat;
      for(var i = 0; i < 3; i++){
        waypoints[i]=[];
        angle2 = angle1;
        for(var j = 0; j < pointsCount; j++ ){
          waypoints[i][j] = {};
          dx = distance*Math.cos(angle2);
          dy = distance*Math.sin(angle2);
          deltaLng = dx/(111320*Math.cos(coord.lat));
          deltaLat = dy/110540;
          coord.lng = coord.lng + deltaLng;
          coord.lat = coord.lat + deltaLat;
          angle2 += Math.PI*2/pointsCount;
          waypoints[i][j].location = JSON.parse(JSON.stringify(coord));
        }
        angle1 += Math.PI*2/8;
        console.log(waypoints[i]);
      }
    }
}]);