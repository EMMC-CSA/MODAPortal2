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
			d3.select("#graphVizContainer").graphviz()
			.renderDot($scope.modaData.workflowDOT);
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
		$scope.modaData.workflowDOT = 'digraph G {rankdir=LR; splines="ortho"; ranksep=0.8; nodesep=1.5; edge[constraint=false];}';
	}

	$scope.modelVariants = [
	{id:1, name: "NAME 1", entity: "ENTITY 1"},
	{id:2, name: "NAME 2", entity: "ENTITY 2"},
	{id:3, name: "NAME 3", entity: "ENTITY 3"},
	{id:4, name: "NAME 4", entity: "ENTITY 4"}
	]; 

	// d3.graphviz("#graphVizContainer")
	// .fade(false)
	// .renderDot('digraph G {rankdir=LR; splines="ortho"; ranksep=1.5; nodesep=2; subgraph cluster_0 {node [style=filled] a0[fillcolor="#e07b7b" label="a very long label"];a0 -> a1 -> a2 -> a3;label = "MODEL #1";}subgraph cluster_1 {node [style=filled];b0 -> b1 -> b2 -> b3;label = "MODEL #2";} edge[constraint=false]; a3->b1;}');

	$scope.mathmltext= function(html_code){       
		return $sce.trustAsHtml(html_code);
	}
	$scope.go = function ( path ) {
		$location.path( path );
	}

	$scope.regenerateworkflow = function(){
		$scope.modaData.workflowDOT = 'digraph G {rankdir=LR; splines="ortho"; nodesep=1.5; edge[constraint=false]; }';

		for (i = 0; i < $scope.modaData.models.length; i++) {
			var model = $scope.modaData.models[i];
			var modelNum = i+1;
			var nodeNames = []
			for(var j=0; j<4; j++){
				var name = 'n' + modelNum + '_' + j;
				nodeNames.push(name);
			}

			var DOTstr = ' subgraph model_' + modelNum + ' {node [style=filled, fontsize = 10, width=1.8, height=1.1] ' + nodeNames[0] + '[fillcolor="#e07b7b" label="user case input"] ' + nodeNames[1] + '[fillcolor="#bedde7" label="model'+ modelNum +'"] ' + nodeNames[2] + '[fillcolor="#529642" label="raw output"] ' + nodeNames[3] + '[fillcolor="#d6fdd0" label="processed output"]; '+ nodeNames[0] +' -> '+ nodeNames[1] +' -> '+ nodeNames[2] +' -> '+ nodeNames[3] +'; label = "MODEL ' + modelNum + '";}';
			var insertPos = $scope.modaData.workflowDOT.indexOf("nodesep=1.5;")+13;
			var output = [$scope.modaData.workflowDOT.slice(0, insertPos), DOTstr, $scope.modaData.workflowDOT.slice(insertPos)].join('');
			$scope.modaData.workflowDOT = output;

			var relStr = '';
			for (var k=0; k<model.link_to_models.length; k++){
				var linkedModelNum = model.link_to_models[k];
				var linkedNodeModelName = 'n' + linkedModelNum + '_1';
				var thisNodeModelName = 'n' + modelNum + '_3';
				relStr += thisNodeModelName+'->'+linkedNodeModelName+'; ';
			}

			insertPos = $scope.modaData.workflowDOT.lastIndexOf("}")-1;
			output = [$scope.modaData.workflowDOT.slice(0, insertPos), relStr, $scope.modaData.workflowDOT.slice(insertPos)].join('');
			$scope.modaData.workflowDOT = output;
		}

		angular.element(document.querySelector('#graphVizContainer')).empty();

		d3.select("#graphVizContainer").graphviz()
		.renderDot($scope.modaData.workflowDOT);
	}

	$scope.addmodel = function() {
		var model = {
			link_to_models: []
		};
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