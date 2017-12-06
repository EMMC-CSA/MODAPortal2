angular.module('app.controllers').controller('modasCtrl', function($scope, $timeout, $location, $route, AuthService, UsersService, ModasService) {
	
	$scope.$emit('simulateClick', 'modasBtn');
	$scope.modasOffset = 0;
	$scope.fetchedAllModas = false;

	$scope.go = function ( path ) {
		$location.path( path );
	}

	$scope.$emit('showloading', true);
	ModasService.getUserModas($scope.modasOffset).then(function(res) {
		$scope.modas = res.data.data;
		$scope.$emit('showloading', false);
		if (res.status  == 400){
			console.log(res);
		}
	});

	$scope.loadMoreModas = function() {
		$scope.modasOffset += 20;
		$scope.$emit('showloading', true);
		ModasService.getUserModas($scope.modasOffset).then(function(res) {
			$scope.$emit('showloading', false);
			if (res.data.data.length == 0) {
				$scope.fetchedAllModas = true;
			}
			$scope.modas = $scope.modas.concat(res.data.data);
		});
	}

});