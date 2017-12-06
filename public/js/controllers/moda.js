angular.module('app.controllers').controller('modaCtrl', function($scope, $timeout, $location, $route, $routeParams, $sanitize, $sce, ModasService) {

	$scope.modaIdParam = $routeParams.modaIdParam;

	if ($scope.modaIdParam) {
		ModasService.getModa(parseInt($scope.modaIdParam)).then(function(res) {
			$scope.modaData = res.data.data.data;
			$scope.modaId = res.data.data.id;
		});
	} else{
		$scope.modaData = {
			models:[]
		};
	}

	$scope.mathmltext= function(html_code){       
		return $sce.trustAsHtml(html_code);
	}
	$scope.go = function ( path ) {
		$location.path( path );
	}

	$scope.addmodel = function() {
		var model = {};
		$scope.modaData.models.push(model);
	}

	$scope.removemodel = function(index) {
		$scope.modaData.models.splice(index, 1);
	}

	$scope.updatemodeltype = function(index){
		var originalmodel = $scope.modaData.models[index];
		$scope.modaData.models[index] = {};
		$scope.modaData.models[index]['type'] = originalmodel.type;
	}

	$scope.save = function(){
		$scope.$emit('showloading', true);
		if ($scope.modaIdParam && $scope.modaId){
			ModasService.updateModa($scope.modaData, $scope.modaId).then(function(res) {
				$scope.$emit('showloading', false);
				if (res.status == 200) {
					$location.path('/modas');
				} else {
					$scope.$emit('showErr', true, "something went wrong. please retry");
				}
			});
		} else {
			ModasService.addModa($scope.modaData).then(function(res) {
				$scope.$emit('showloading', false);
				if (res.status == 201) {
					$location.path('/modas');
				} else {
					$scope.$emit('showErr', true, "something went wrong. please retry");
				}
			});
		}
	}
});