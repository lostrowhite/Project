angular.module('agence', ['ngMaterial', 'ngRoute', 'ngResource','googlechart'])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange')
        .warnPalette('red');
})
.config(function($routeProvider) {
	$routeProvider.when('/consultor', {
		templateUrl : 'angular-views/consultor.html'
	});
})