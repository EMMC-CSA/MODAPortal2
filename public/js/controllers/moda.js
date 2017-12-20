angular.module('app.controllers').controller('modaCtrl', function($scope, $timeout, $location, $route, $routeParams, $sanitize, $sce, ModasService) {

	$scope.modaIdParam = $routeParams.modaIdParam;
	$scope.expandedModels = [];
	$scope.expandedPhysEqs = [];
	$scope.expandedPhysQuants = [];
	$scope.expandedMatRels = [];
	$scope.expandedMatQuants = [];
	$scope.expandedAspects = [];
	$scope.expandedGenPhysics = [];
	$scope.expandedSolverComps = [];
	$scope.expandedPostProcessings = [];

	$scope.modelTypes = [
	{
		"name": "Electronic Models",
		"entityName": "Electron",
		"elements": [
		{
			"name": "Schrödinger Equation based models",
			"elements": [
			{
				"name": "Single particle Schrödinger models",
				"elements": [
				{
					"name": "Ab initio quantum mechanical (or first principle) models",
					"elements": []
				},
				{
					"name": "Schrödinger equation with Hartree-Fock Hamiltonian model",
					"elements": []
				},
				{
					"name": "Higher level ab initio models",
					"elements": []
				},
				]
			},
			{
				"name":  "Many body Schrödinger models",
				"elements": [
				{
					"name": "Schrödinger equation with nearly free electron Hamiltonian model",
					"elements": []
				},
				{
					"name": "Schrödinger with semi-empirical tight binding Hamiltonian model",
					"elements": []
				},
				{
					"name": "Schrödinger equation with Hubbard Hamiltonian model",
					"elements": []
				},
				{
					"name": "Schrödinger equation with k⋅p effective Hamiltonian model",
					"elements": []
				}
				]
			},
			{
				"name":  "Quantum mechanical time dependant Schrödinger models",
				"elements": [
				{
					"name": "The time-dependent Schrödinger equation with k⋅p effective Hamiltonian model",
					"elements": []
				},
				{
					"name": "Other time-dependent Schrödinger models",
					"elements": []
				}
				]
			}
			]
		},
		{
			"name": "Kohn Sham equation Density Functional Theory (electronic DFT)",
			"elements": [
			{
				"name": "Kohn-Sham equation, Pseudopotentials, Projector Augmented Waves",
				"elements": []
			},
			{
				"name": "TD-DFT and TD(Spin)DFT",
				"elements": []
			}
			]
		},
		{
			"name": "Quantum Dynamic Mean Field Theory",
			"elements": []
		},
		{
			"name": "NEGF",
			"elements": []
		},
		{
			"name": "Representations of continuous media",
			"elements": [
			{
				"name": "Polarisable continuum approximation",
				"elements": []
			},
			{
				"name": "Envelope function approximation",
				"elements": []
			}
			]
		},
		{
			"name": "Statistical charge transport model",
			"elements": [
			{
				"name": "Statistical semi-classical transport model for drift-diffusion (BTE)",
				"elements": []
			},
			{
				"name": "Fermi Golden Rule (FGR) (hopping model) for quasi particle transport",
				"elements": []
			},
			{
				"name": "Percolation models",
				"elements": []
			}
			]
		},
		{
			"name": "Statistical spin transport model",
			"elements": []
		}
		]
	},
	{
		"name": "Atomistic models",
		"entityName": "Atom",
		"elements": [
		{
			"name": "Classical Density Functional Theory and Dynamic Density Functional Theory",
			"elements": []
		},
		{
			"name": "Newton's equation based model",
			"elements": [
			{
				"name": "Molecular Mechanics",
				"elements": []
			},
			{
				"name": "Molecular Dynamics (MD)",
				"elements": [
				{
					"name": "Classical Molecular Dynamics",
					"elements": []
				},
				{
					"name": "Ab initio Molecular Dynamics",
					"elements": []
				},
				{
					"name": "Quantum Mechanics/Molecular Mechanics (QM/MM) a workflow",
					"elements": []
				}
				]
			}
			]
		},
		{
			"name": "Statistical Mechanics atomistic models",
			"elements": [
			{
				"name": "Monte Carlo Molecular Models",
				"elements": []
			},
			{
				"name": "Kinetic Monte Carlo Models",
				"elements": []
			}
			]
		},
		{
			"name": "Atomistic spin models",
			"elements": [
			{
				"name": "Deterministics spin models",
				"elements": []
			},
			{
				"name": "Langevin Dynamic method for magnetic spin systems",
				"elements": []
			}
			]
		},
		{
			"name": "Statistical transport model at atomistic level",
			"elements": []
		},
		{
			"name": "Atomistic phonon-based models (Boltzmann Transport Equation)",
			"elements": []
		}
		]
	},
	{
		"name": "Mesoscopic (particle) models",
		"entityName": "Particle",
		"elements": [
		{
			"name": "Mesoscopic Classical Density Functional Theory and Dynamic Density Functional Theory",
			"elements": []
		},
		{
			"name": "Coarse-Grained Molecular Dynamics and Dissipative Particle Dynamics",
			"elements": [
			{
				"name": "Coarse-Grained Molecular Dynamics",
				"elements": []
			},
			{
				"name": "Dissipative Particle Dynamics (DPD)",
				"elements": []
			}
			]
		},
		{
			"name": "Statistical Mechanics mesoscopic models",
			"elements": []
		},
		{
			"name": "Micromagnetic models",
			"elements": []
		},
		{
			"name": "Mesoscopic phonon models (Boltzmann Transport Equation)",
			"elements": []
		}
		]
	},
	{
		"name": "Continuum modelling of materials",
		"entityName": "Continuum Volume",
		"elements": [
		{
			"name": "Solid Mechanics",
			"elements": []
		},
		{
			"name": "Fluid Mechanics",
			"elements": []
		},
		{
			"name": "Heat Flow and Thermo-mechanical behaviour",
			"elements": []
		},
		{
			"name": "Continuum Thermodynamics and Phase Field models",
			"elements": [
			{
				"name": "Thermodynamics",
				"elements": []
			},
			{
				"name": "Phase Field models",
				"elements": []
			}
			]
		},
		{
			"name": "Chemistry reaction (kinetic) models (continuum)",
			"elements": []
		},
		{
			"name": "Electromagnetism (including optics, magnetics and electrical)",
			"elements": [
			{
				"name": "Magnetics",
				"elements": []
			},
			{
				"name": "Electr(on)ic",
				"elements": []
			},
			{
				"name": "Optics",
				"elements": []
			}
			]
		}
		]
	}
	];

	$scope.ui = {
		showOverview: false,
		showWorkflow: false,
		showModels: true,
	}

	$scope.addedModelsIndexes = [ 1,2,3];
	$scope.multiSelectSettings = { template: '{{option}}', smartButtonTextConverter(skip, option) { return option; }, };

	if ($scope.modaIdParam) {
		ModasService.getModa(parseInt($scope.modaIdParam)).then(function(res) {
			$scope.modaData = res.data.data.data;
			$scope.modaId = res.data.data.id;
			angular.element(document.querySelector('#graphVizContainer')).empty();
			d3.select("#graphVizContainer").graphviz()
			.zoom(false)
			.renderDot($scope.modaData.workflowDOT);
		});
	} else{
		$scope.modaData = {
			simulation_overview: {},
			models:[]
		};
		$scope.modaData.workflowDOT = 'digraph G {rankdir=LR; splines="ortho"; ranksep=equally;}';
	}

	$scope.toggleOverview = function(){
		$scope.ui.showOverview = !$scope.ui.showOverview;
	}


	$scope.toggleWorkflow = function(){
		$scope.ui.showWorkflow = !$scope.ui.showWorkflow;
	}

	$scope.toggleModels = function(){
		$scope.ui.showModels = !$scope.ui.showModels;
	}

	$scope.mathmltext= function(html_code){       
		return $sce.trustAsHtml(html_code);
	}
	$scope.go = function ( path ) {
		$location.path( path );
	}

	$scope.splitintolines = function(text, linewidth){
		text = text.length < 90 ? text : text.substring(0, 90) + "...";
		var words = text.split(' ');
		var line = "";
		var outputstr = "";
		var carry = "";
		for(var i=0; i<words.length || carry.length>0; i++){
			var word = i < words.length ? words[i] : "";
			line += carry;
			if(line.length<=linewidth){
				if(word.length<=(linewidth-line.length)){
					line += word + " ";
					carry = "";
				} else {
					carry = word.substring(linewidth-line.length, word.length) + " ";
					line += word.substring(0,linewidth-line.length) + "-";
					outputstr += line + "\n";
					line = "";
				}
				if(i >= words.length-1 && carry.length == 0)
					outputstr += line + "\n";
			} else {
				outputstr += line + "\n";
				line = "";
			}
		}
		return outputstr;
	}

	$scope.regenerateworkflow = function(){
		$scope.modaData.workflowDOT = 'digraph G {rankdir="LR"; splines="ortho"; ranksep=equally; nodesep=equally; ratio=auto; compound=true; fontname=Courier; center=true; edge[constraint=false]; }';

		for (var i = 0; i < $scope.modaData.models.length; i++) {
			var model = $scope.modaData.models[i];
			var modelNum = model.number;
			var modelShortName = $scope.splitintolines(model.name ? model.name : "",33);
			var modelShortProcess = $scope.splitintolines(model.simulation_aspect.manufacturing_process_conditions ? model.simulation_aspect.manufacturing_process_conditions : "",33);
			var modelShortOutput = $scope.splitintolines(model.post_processing.processed_output ? model.post_processing.processed_output : "",33);
			var nodeNames = []
			for(var j=0; j<4; j++){
				var name = 'n' + modelNum + '_' + j;
				nodeNames.push(name);
			}

			var DOTstr = ' subgraph model_' + modelNum + ' {node [style=filled, fontsize = 10, width=2.5, height=1.5, fixedsize=true] ' + nodeNames[0] + '[fillcolor="#e07b7b" label="' + modelShortProcess + '"] ' + nodeNames[1] + '[fillcolor="#bedde7" label="'+ modelShortName +'"] ' + nodeNames[2] + '[fillcolor="#529642" label="See Quantities of PEs"] ' + nodeNames[3] + '[fillcolor="#d6fdd0" label="' + modelShortOutput + '"]; '+ nodeNames[0] +' -> '+ nodeNames[1] +' -> '+ nodeNames[2] +' -> '+ nodeNames[3] +'; label = "MODEL ' + modelNum + '";} ';
			var insertPos = $scope.modaData.workflowDOT.indexOf("nodesep=equally;")+17;
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

			relStr = '';
			var tempStr = "";
			for (var l=0; l<model.couple_to_models.length; l++){
				var coupledModelNum = model.couple_to_models[l];
				var coupleNodeModelName = 'n' + coupledModelNum + '_1';
				var thisNodeModelName = 'n' + modelNum + '_3';
				tempStr = thisNodeModelName+'->'+coupleNodeModelName+'; ';
				if($scope.modaData.workflowDOT.indexOf(tempStr) < 0)
					relStr += tempStr;

				var coupleNodeModelName = 'n' + coupledModelNum + '_3';
				var thisNodeModelName = 'n' + modelNum + '_1';
				tempStr = coupleNodeModelName+'->'+thisNodeModelName+'; ';
				if($scope.modaData.workflowDOT.indexOf(tempStr) < 0)
					relStr += tempStr;
			}
			insertPos = $scope.modaData.workflowDOT.lastIndexOf("}")-1;
			output = [$scope.modaData.workflowDOT.slice(0, insertPos), relStr, $scope.modaData.workflowDOT.slice(insertPos)].join('');
			$scope.modaData.workflowDOT = output;
		}

		angular.element(document.querySelector('#graphVizContainer')).empty();

		d3.select("#graphVizContainer").graphviz()
		.zoom(false)
		.renderDot($scope.modaData.workflowDOT);
	}

	$scope.hasCoupled = function(model, index){
		var coupledIndex = index + 1;
		if(model.couple_to_models.indexOf(coupledIndex) > -1){
			return true;
		}else{
			return false;
		}
	}

	$scope.modifyModelType = function(model){
		model.typeobj = {};
		model.subtype_1obj = {};
		model.subtype_1 = "";
		model.subtype_2obj = {};
		model.subtype_2 = "";
		model.subtype_3 = "";
		model.entity = "";
		for(var i=0; i<$scope.modelTypes.length; i++){
			var modeltype = $scope.modelTypes[i];
			if(modeltype.name == model.type){
				model.typeobj = modeltype;
				model.entity = model.typeobj.entityName;
			}

		}
	}

	$scope.modifyModelSubType1 = function(model){
		model.subtype_1obj = {};
		model.subtype_2obj = {};
		model.subtype_2 = "";
		for(var i=0; model.typeobj.elements && i<model.typeobj.elements.length; i++){
			var modelsubtype = model.typeobj.elements[i];
			if(modelsubtype.name == model.subtype_1)
				model.subtype_1obj = modelsubtype;
		}
	}

	$scope.modifyModelSubType2 = function(model){
		model.subtype_2obj = {};
		model.subtype_3 = "";
		for(var i=0; model.subtype_1obj.elements && i<model.subtype_1obj.elements.length; i++){
			var modelsubtype = model.subtype_1obj.elements[i];
			if(modelsubtype.name == model.subtype_2)
				model.subtype_2obj = modelsubtype;
		}
	}


	$scope.modifyCoupling = function(model){
		var thisModelNum = model.number;

		//uncouple
		for (var i=0; i<$scope.modaData.models.length; i++){
			if (i !== model.index){
				var mmodel = $scope.modaData.models[i];
				if(mmodel.couple_to_models.indexOf(thisModelNum) > -1){
					mmodel.couple_to_models.splice(mmodel.couple_to_models.indexOf(thisModelNum), 1);
				}
			}
		}
		
		//couple
		for (var j=0; j < model.couple_to_models.length; j++){
			var coupledModelIndex = model.couple_to_models[j]-1;
			if($scope.modaData.models[coupledModelIndex].couple_to_models.indexOf(thisModelNum) < 0)
				$scope.modaData.models[coupledModelIndex].couple_to_models.push(thisModelNum);

			// remove indivudal links
			if(model.link_to_models.indexOf(model.couple_to_models[j]) > -1)
				model.link_to_models.splice(model.link_to_models.indexOf(model.couple_to_models[j]), 1);
			if($scope.modaData.models[coupledModelIndex].link_to_models.indexOf(thisModelNum) > -1){
				var linkedModelIndex = $scope.modaData.models[coupledModelIndex].link_to_models.indexOf(thisModelNum);
				$scope.modaData.models[coupledModelIndex].link_to_models.splice(linkedModelIndex, 1);
			}
		}
	}

	$scope.addmodel = function() {
		var model = {
			link_to_models: [],
			couple_to_models: [],
			simulation_aspect: {},
			solver_comp_translation: {
				computational_representation: {}
			},
			post_processing: {}
		};
		var index = $scope.modaData.models.push(model) - 1;
		model.index = index;
		model.number = index+1;
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

	$scope.expandAspect = function(index){
		$scope.expandedAspects.push(index);
	}
	$scope.collapseAspect = function(index){
		$scope.expandedAspects.splice($scope.expandedAspects.indexOf(index), 1);
	}

	$scope.expandGenPhysics = function(index){
		$scope.expandedGenPhysics.push(index);
	}
	$scope.collapseGenPhysics = function(index){
		$scope.expandedGenPhysics.splice($scope.expandedGenPhysics.indexOf(index), 1);
	}

	$scope.expandSolverComp = function(index){
		$scope.expandedSolverComps.push(index);
	}
	$scope.collapseSolverComp  = function(index){
		$scope.expandedSolverComps.splice($scope.expandedSolverComps.indexOf(index), 1);
	}

	$scope.expandPostProcessing = function(index){
		$scope.expandedPostProcessings.push(index);
	}
	$scope.collapsePostProcessing = function(index){
		$scope.expandedPostProcessings.splice($scope.expandedPostProcessings.indexOf(index), 1);
	}

	$scope.addphyseq = function(model) {
		var physeq = {};
		if(!model.physics_equations)
			model.physics_equations = [];
		var index = model.physics_equations.push(physeq) - 1;
		$scope.expandphyseq(index);
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
		var index = physicseq.physics_quantities.push(physquant) - 1;
		$scope.expandphysquant(index);
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
		var index = model.materials_relations.push(materialrel) - 1;
		$scope.expandmaterialsrel(index);
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
		var index = materialrel.material_quantities.push(matquant) - 1;
		$scope.expandmatquant(index);
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
		$scope.regenerateworkflow();
		if ($scope.modaIdParam && $scope.modaId){
			ModasService.updateModa($scope.modaData, $scope.modaId).then(function(res) {
				$scope.$emit('showloading', false);
				if (res.status == 200) {
					$scope.$emit('showMsg', true, "SAVED");
				} else {
					$scope.$emit('showErr', true, "something went wrong. please retry");
				}
			});
		} else {
			ModasService.addModa($scope.modaData).then(function(res) {
				$scope.$emit('showloading', false);
				if (res.status == 201) {
					var path = "/modas/" + res.data.data.id;
					$scope.go(path);
				} else {
					$scope.$emit('showErr', true, "something went wrong. please retry");
				}
			});
		}
	}
});