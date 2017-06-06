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

prestapp.service('objetoService', function($http, $cookies, $location){
	this.obtenerObjetosDisponibles = function(){
		return $http({
			url: 'http://localhost:8081/PrestappWS/prestapp/objeto/disponibles',
			method: 'GET'
		});
	}

	this.realizarPrestamo = function(username, idObjeto){
		return $http({
			url:  'http://localhost:8081/PrestappWS/prestapp/prestamo/realizarPrestamo',
			method: 'POST',
			params: {
				usuario: username,
				id: idObjeto
			}
		}); 	
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

prestapp.controller("nuevoPrestamo", function ($scope, $location, $cookies, objetoService){
	objetoService.obtenerObjetosDisponibles().then(
			function success(data){
				$scope.objetos = data.data;
				console.log(data.data);
			}
			);
	$scope.realizarPrestamo = function(){
		objetoService.realizarPrestamo($scope.username, $scope.idObjeto).then(
			function success(data){
				console.log("consumido el servicio de realizar prestamo");
				if(data.data == 'listo'){
					$scope.username = '';
					$scope.idObjeto = '';
					$location.url('/nuevoPrestamo');		
				}
				else{
					alert("No se pudo realizar el prestamo: "+ data.data);
				}
			})
	}
})

prestapp.controller("navBarController", function ($scope, $location, $cookies){
	$scope.openLogin = function(){
		$location.url('/');
	}
	$scope.openPrestamo = function(){
		$location.url('/nuevoPrestamo');
	}
	$scope.openDevolucion = function(){
		$location.url('/nuevoPrestamo');
	}
	$scope.openSanciones = function(){
		$location.url('/nuevoPrestamo');
	}
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

prestapp.directive('header', function(){
		return{
			restrict: 'E',
			templateUrl: 'header.html',
			controller: 'navBarController'
		};
	});
