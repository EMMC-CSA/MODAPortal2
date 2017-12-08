angular.module('app.controllers').controller('modaCtrl', function($scope, $timeout, $location, $route, $routeParams, $sanitize, $sce, ModasService) {

	$scope.modaIdParam = $routeParams.modaIdParam;
	$scope.expandedModels = [];
	$scope.expandedPhysEqs = [];
	$scope.expandedPhysQuants = [];
	$scope.expandedMatRels = [];
	$scope.expandedMatQuants = [];

	if ($scope.modaIdParam) {
		ModasService.getModa(parseInt($scope.modaIdParam)).then(function(res) {
			$scope.modaData = res.data.data.data;
			$scope.modaId = res.data.data.id;
		});
	} else{
		$scope.modaData = {
			simulation_overview: {},
			models:[],
			solver_comp_translation: {
				computational_representation: {}
			},
			post_processing: {}
		};
	}

	$scope.modelVariants = [
	{id:1, name: "NAME 1", entity: "ENTITY 1"},
	{id:2, name: "NAME 2", entity: "ENTITY 2"},
	{id:3, name: "NAME 3", entity: "ENTITY 3"},
	{id:4, name: "NAME 4", entity: "ENTITY 4"}
	]; 

	d3.graphviz("#graphVizContainer")
	.fade(false)
	.renderDot('digraph G {rankdir=LR; subgraph cluster_0 {node [style=filled];a0 -> a1 -> a2 -> a3;label = "process #1";}subgraph cluster_1 {node [style=filled];b0 -> b1 -> b2 -> b3;label = "process #2";}a3->b1[constraint=true]}');

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
		$scope.expandedModels.splice($scope.expandedModels.indexOf(index), 1);
	}
	$scope.expandModel = function(index){
		$scope.expandedModels.push(index);
	}
	$scope.collapseModel = function(index){
		$scope.expandedModels.splice($scope.expandedModels.indexOf(index), 1);
	}

	$scope.addphyseq = function(model) {
		var physeq = {};
		if(!model.physics_equations)
			model.physics_equations = [];
		model.physics_equations.push(physeq);
	}
	$scope.removephyseq = function(model, index) {
		model.physics_equations.splice(index, 1);
		$scope.expandedPhysEqs.splice($scope.expandedPhysEqs.indexOf(index), 1);
	}
	$scope.expandphyseq = function(index){
		$scope.expandedPhysEqs.push(index);
	}
	$scope.collapsephyseq = function(index){
		$scope.expandedPhysEqs.splice($scope.expandedPhysEqs.indexOf(index), 1);
	}

	$scope.addphysquant = function(physicseq) {
		var physquant = {};
		if(!physicseq.physics_quantities){
			physicseq.physics_quantities = [];
		}
		physicseq.physics_quantities.push(physquant);
	}
	$scope.removephysquant = function(physicseq, index) {
		physicseq.physics_quantities.splice(index, 1);
		$scope.expandedPhysQuants.splice($scope.expandedPhysQuants.indexOf(index), 1);
	}
	$scope.expandphysquant = function(index){
		$scope.expandedPhysQuants.push(index);
	}
	$scope.collapsephysquant = function(index){
		$scope.expandedPhysQuants.splice($scope.expandedPhysQuants.indexOf(index), 1);
	}

	$scope.addmaterialsrel = function(model) {
		var materialrel = {};
		if(!model.materials_relations){
			model.materials_relations = [];
		}
		model.materials_relations.push(materialrel);
	}
	$scope.removematerialsrel = function(model, index) {
		model.materials_relations.splice(index, 1);
		$scope.expandedMatRels.splice($scope.expandedMatRels.indexOf(index), 1);
	}
	$scope.expandmaterialsrel = function(index){
		$scope.expandedMatRels.push(index);
	}
	$scope.collapsematerialsrel = function(index){
		$scope.expandedMatRels.splice($scope.expandedMatRels.indexOf(index), 1);
	}


	$scope.addmatquant = function(materialrel) {
		var matquant = {};
		if(!materialrel.material_quantities){
			materialrel.material_quantities = [];
		}
		materialrel.material_quantities.push(matquant);
	}
	$scope.removematquant = function(materialrel, index) {
		materialrel.material_quantities.splice(index, 1);
		$scope.expandedMatQuants.splice($scope.expandedMatQuants.indexOf(index), 1);
	}
	$scope.expandmatquant = function(index){
		$scope.expandedMatQuants.push(index);
	}
	$scope.collapsematquantt = function(index){
		$scope.expandedMatQuants.splice($scope.expandedMatQuants.indexOf(index), 1);
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