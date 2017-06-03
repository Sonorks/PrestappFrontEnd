/**
 * 
 */

var prestapp = angular.module('prestapp',['ngRoute','ngCookies']);

prestapp.service('loginService', function($http, $cookies, $location){
	this.logear = function(usuario, contrasena){
		return $http({
			url: 'http://localhost:8081/PrestappWS/prestapp/usuario/login',
			method: 'POST',
			params: {
				login: usuario, 
				pws: contrasena
			}
		});
	}
	this.validarEstado = function(){
		if(typeof($cookies.usuario) == 'undefined' ||
				$cookies.usuario == ""){
			$location.url("/");
			return false;
		}
	}
});


prestapp.controller("login", function($scope, $location, $cookies, loginService){
	$scope.usuario = '';
	$scope.contrasena = '';
	$scope.logear = function(){
		loginService.logear($scope.usuario, $scope.contrasena).then(
				function success(data){
					if(data.data == 'Credenciales incorrectas'){
						$scope.usuario = '';
						$scope.contrasena = '';
						alert(data.data);
						return;
					}
					$cookies.usuario = $scope.usuario;
					$location.url('/nuevoPrestamo');
				});
	}
})

prestapp.controller("nuevoPrestamo", function ($scope, $location, $cookies){
	
})


prestapp.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'login.html',
		controller: 'login'
	})
	$routeProvider.when('/nuevoPrestamo',{
		templateUrl: 'nuevoPrestamo.html',
		controller: 'nuevoPrestamo'
	})
}])