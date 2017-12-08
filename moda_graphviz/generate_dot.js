var nModels = 6;
var dot_script = "";
var modelLabels = {
    1 : {
        "uci" : "Freiburg im Breisgau",
        "m" : "Deutschland",
        "ro": "Ende gut, alles gut",
        "po": "Deutschland or Germany is in Europe"
    },
    2 : {
        "uci" : "This Node is for User Case Input",
        "m" : "This is Model Node",
        "ro": "Raw Output Node",
        "po": "Processed Output node is the last node in a model"
    },
    3 : {
        "uci" : "This Node is for User Case Input",
        "m" : "This is Model Node",
        "ro": "Raw Output Node",
        "po": "Processed Output node is the last node in a model"
    },
    4 : {
        "uci" : "This Node is for User Case Input",
        "m" : "This is Model Node",
        "ro": "Raw Output Node",
        "po": "Processed Output node is the last node in a model"
    },
    5 : {
        "uci" : "This Node is for User Case Input",
        "m" : "This is Model Node",
        "ro": "Raw Output Node",
        "po": "Processed Output node is the last node in a model"
    },
    6 : {
        "uci" : "This Node is for User Case Input",
        "m" : "This is Model Node",
        "ro": "Raw Output Node",
        "po": "Processed Output node is the last node in a model"
    }
};

var coupling = {
    1: {"tail":1, "head":2, "type":1},
    2: {"tail":2, "head":3, "type":1},
    3: {"tail":3, "head":4, "type":2},
    4: {"tail":4, "head":5, "type":2},
    5: {"tail":5, "head":6, "type":1},
    6: {"tail":6, "head":1, "type":2},
};

function insertTokens(rawStr){
    var count = 0;
    var proStr = "";
    var rawStrArray = rawStr.split(" ");
    if (rawStr.length <= 15) {
	return rawStr;
    } else {
	for (i=0; i<rawStrArray.length; i++){
	    proStr += rawStrArray[i];
	    count += rawStrArray[i].length;
	    if ((count > 15) && (i < rawStrArray.length-1) ) {    // allow 15 character at most for every line of label string in a node
		count = 0;
		proStr += "\\n";
	    } else {
		proStr += " ";
	    }
	}
    }
    return proStr;
}

function process_labels(modelLabels){
    // perform text wrapping for long labels inside nodes
    for (var key in modelLabels){
	uci = modelLabels[key]["uci"];
	modelLabels[key]["uci"] = insertTokens(uci);
	
	m = modelLabels[key]["m"];
	modelLabels[key]["m"] = insertTokens(m);
	
	ro = modelLabels[key]["ro"];
	modelLabels[key]["ro"] = insertTokens(ro);
	
	po = modelLabels[key]["po"];
	modelLabels[key]["po"] = insertTokens(po);
    }
    return modelLabels;
}

function init_graph(dot_script){
    // initialize graph properties
    dot_script += "strict digraph G { "
        + "ranksep=equally; "
        + "nodesep=equally; "
        + "ratio=auto; "
        + "compound=true; "
        + "fontname=Courier; "
        + "centre=true; "
        + "splines=ortho; "
	+ "fixedsize=true; ";
    return dot_script;
}

function declareModelNodes(nModels, modelLabels, dot_script){
    // declare the nodes in model
    dot_script += " ";
    for (i=1; i<=nModels; i++){

        // User Case Input Node
        dot_script += "uci"+i+" [color=pink, style=filled, height=1.4, width=2.5, group=1, label=\"" + modelLabels[i]["uci"] + "\"]; ";
        // Model Node
        dot_script += "m"+i+" [color=lightblue, style=filled, height=1.4, width=2.5, group=2, label=\"" + modelLabels[i]["m"] + "\"]; ";
        // Raw Output Node
        dot_script += "ro"+i+" [color=forestgreen, style=filled, height=1.4, width=2.5, group=3, label=\"" + modelLabels[i]["ro"] + "\"]; ";
        // Processed Output Node
        dot_script += "po"+i+" [color=palegreen, style=filled, height=1.4, width=2.5, group=4, label=\"" + modelLabels[i]["po"] + "\"]; ";
    }

    return dot_script;
}

function declareNodeRanks(nModels, dot_script){
    // all nodes in a single model should have same level
    dot_script += " ";
    for (i=1; i<=nModels; i++){
        dot_script += "{rank=same; uci" + i
            + ", m" + i
            + ", ro" + i
            + ", po" + i
            + "}; ";
    }
    return dot_script;
}

function edgeUCI(nModels, dot_script){
    // draw hidden edges between UCI nodes
    for (i=1; i<nModels; i++){
        dot_script += "uci" + i + " -> uci" + (i+1) + " [style=\"invis\"]; "
    }
    dot_script += " ";
    return dot_script;
}

function edgeM(nModels, dot_script){
    // draw hidden edges between M nodes
    for (i=1; i<nModels; i++){
        dot_script += "m" + i + " -> m" + (i+1) + " [style=\"invis\"]; "
    }
    dot_script += " ";
    return dot_script;
}

function edgeRO(nModels, dot_script){
    // draw hidden edges between RO nodes
    for (i=1; i<nModels; i++){
        dot_script += "ro" + i + " -> ro" + (i+1) + " [style=\"invis\"]; "
    }
    dot_script += " ";
    return dot_script;
}

function edgePO(nModels, dot_script){
    // draw hidden edges between all PO nodes
    for (i=1; i<nModels; i++){
        dot_script += "po" + i + " -> po" + (i+1) + " [style=\"invis\"]; "
    }
    dot_script += " ";
    return dot_script;
}

function declareHiddenEdges(nModels, dot_script){
    // join same nodes with hidden edges to maintain order
    dot_script += " ";
    dot_script = edgeUCI(nModels, dot_script);
    dot_script = edgeM(nModels, dot_script);
    dot_script = edgeRO(nModels, dot_script);
    dot_script = edgePO(nModels, dot_script);
    return dot_script;
}

function intraModelEdges(nModels, dot_script){
    // join uci, m, ro and po nodes in every model
    dot_script += " ";
    for (i=1; i<=nModels; i++){
        dot_script += "uci"+i+" -> m"+i+" -> ro"+i+" -> po"+i+"; ";
    }
    return dot_script;
}

function coupleType1(dot_script, tail, head){
    // linked model coupling
    dot_script += "po" + tail + " -> m" + head + "; "
    return dot_script;
}

function coupleType2(dot_script, tail, head){
    // iterative coupling
    dot_script += "po" + tail + " -> m" + head + "; "
    dot_script += "po" + head + " -> m" + tail + "; "
    return dot_script;
}
function interModelEdges(coupling, nModels, dot_script){
    // join models 
    dot_script += " ";

    for (var key in coupling){
        if (coupling[key]["type"] === "Linked"){
            dot_script = coupleType1(dot_script, coupling[key]["tail"], coupling[key]["head"]);
        } else {
            dot_script = coupleType2(dot_script, coupling[key]["tail"], coupling[key]["head"]);
        }
    }
    return dot_script;
}

function insertLastBracket(dot_script){
    // insert last }
    dot_script += " }";
    return dot_script;
}

function getDotScript(nModels, coupling, modelLabels){
  
    var dot_script = "";
    modelLabels = process_labels(modelLabels);
    dot_script = init_graph(dot_script);
    dot_script = declareModelNodes(nModels, modelLabels, dot_script);
    dot_script = declareNodeRanks(nModels, dot_script);
    dot_script = declareHiddenEdges(nModels, dot_script);
    dot_script = intraModelEdges(nModels, dot_script);
    dot_script = interModelEdges(coupling, nModels, dot_script);
    dot_script = insertLastBracket(dot_script);
    return dot_script;
}
    
    
