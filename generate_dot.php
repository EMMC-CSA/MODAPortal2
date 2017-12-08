<!DOCTYPE html>
<html>
    <head>
	<meta charset="UTF-8">
	<style>
	    form#multiphase{ padding:24px; width:1000px; }
	    form#multiphase > #phase2, #phase3{ display:none; }
	</style>
	<script src="generate_dot.js" type="text/javascript"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script>
	    var nModels, dot_script;
	    var coupling = {};     // needed to generate dot_script
	    var arrModels = new Set();    // record of coupling by Add/Remove
	    var n = 1;    // for generating id numbers

	    function _(x){
			return document.getElementById(x);
	    }

	    function addMenuTemplate(){
	    	n++;
	    	arrModels.add(n);

			var divmenu = document.createElement("div");
			divmenu.setAttribute("class", "menu item");
			divmenu.setAttribute("id", "menu item "+n);
			divmenu.innerHTML = getCouplingMenuTemplate(n);
			_("menu").appendChild(divmenu);

	    }

	    function removeMenuTemplate(num){
	    	var objTo = _("menu")
	    	_('menu item '+num).remove();
	    	arrModels.delete(num);
	    }

	    function getCouplingOption(i){
	        return '  Coupling Type: '
					+ '<select id="type'+i+'3" name="m'+i+'3">'
					+ ' <option value="Linked"> Linked </option>'
					+ ' <option value="Iterative"> Iterative </option>'
					+ '</select> '
        			+ '<button onclick="removeMenuTemplate('+i+');"> Remove </button>';
		}

		function getCouplingMenuTemplate(num){
			    var options_1 = ' Coupling Source: <select id="source'+num+'1" name="Coupling Source '+i+'"><option value=""></option>';
			    for (var i=1; i<=nModels; i++){
			    	options_1+='    <option value="' + i + '">Model # ' + i + '</option>';
			    }
			    options_1+='</select>';

			    var options_2 = '  Coupling Target <select id="target'+num+'2" name="Coupling Target"><option value=""></option>';
			    for (var i=1; i<=nModels; i++){
			    	options_2 +='    <option value="' + i + '">Model # ' + i + '</option>';
			    }
			    options_2+='</select>';
			    
			    return options_1 + options_2 + getCouplingOption(num) + '<br>';
		}

	    function processPhase1(){
		    var content='<div class="menu" id="menu">';
		    nModels = _("nModels").value;

			if( Number(nModels) >= 1){
			    _("phase1").style.display = "none";

			    arrModels.add(1);
			    content += '<div class="menu item" id="menu item 1"> Coupling Source: <select id="source11" name="Coupling Source 1"> <option value=""></option> ';
			    for (var i=1; i<=nModels; i++){
			    	content += '<option value="'+i+'">Model # '+i+'</option> ';
			    }
			    content += '</select>  Coupling Target <select id="target12" name="Coupling Target"> <option value=""></option> ';
			    for (var i=1; i<=nModels; i++){
			    	content += '<option value="'+i+'">Model # '+i+'</option> ';
			    }
			    content += '</select>  Coupling Type: <select id="type13" name="m13"> <option value="Linked"> Linked </option> <option value="Iterative"> Iterative </option></select> <button onclick="addMenuTemplate();"> Add </button> <br></div>';

			    content += "</div>"     // class="menu", id="menu"
			    content += "<button onclick=\"generateCoupling();processPhase2();\">Generate Dot Script</button>";
			    _("phase2").innerHTML += content;
			    _("phase2").style.display = "block";
			} else {
			    alert("nModels should be larger than 1");
			}
	    }
	    
	    function generateCoupling(){
	    	var i=0;
	    	var src, trgt, typ;
	    	arrModels.forEach(cpl => {
	    		i++;
	    		coupling[i] = { "tail": _("source"+cpl+"1").value,
								"head": _("target"+cpl+"2").value,
								"type": _("type"+cpl+"3").value}
			});
		}

	    function processPhase2(){
			var modelLabels = {}
			for (var i=1; i<=nModels; i++){
			    modelLabels[i] = {"uci" : "This Node is for User Case Input","m" : "This is Model Node","ro": "Raw Output Node","po": "Processed Output node is the last node in a model"};
			}
			
			// remove the coupling menu
			_("phase2").style.display = "none";
			
			
			dot_script = getDotScript(nModels, coupling, modelLabels);
			//_("phase3text").innerHTML = '<p> IN HTML: \n'+dot_script+'</p>';
			
			$.ajax({
		        url: 'gen_image.php',
		        type: 'POST',
		        data: { name: dot_script },
		        success: function(result){
		        	_("phase3text").innerHTML = '<img src="image.png">';
		        }
		    });	
		    // display image
		    _("phase3").style.display = "block";
   
		}
	</script>
    </head>

    <body>
	<form id="multiphase" onsubmit="return false">
	    <div id="phase1">
		Number of Models: <input id="nModels" name="nModels"><br>
		<button onclick="processPhase1()">Continue to Coupling Menu</button>
	    </div>
	    <div id="phase2">

	    </div>
	    <div id="phase3">
			<p id="phase3text"></p>
	    </div>
	</form>
    </body>
</html>