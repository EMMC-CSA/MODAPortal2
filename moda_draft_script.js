
//global variables
// we use _number for the current number (index), and count for the total count. 
// count of how many pe/mr per model, and how many q per pe for each model
// for each model we need the count of the PE. 
// eg., the number of pe for model 1: pe_count[0]=10, and 
// the number of pe q for the pe's of model 1: pe_q_count [0]=50 etc.. we do not relate *yet*, q to pe, etc. 

var model_count=0;
var pe_count   = new Array(10).fill(0);
var mr_count   = new Array(10).fill(0);
var pe_q_count = new Array();
var mr_q_count = new Array();
var current_model_number = 0;
var usercase, access_conditions, publication; 
var current_model_section_id;
var moda_id = 0;

var placeholders = {
    "overview_usercase":       "General description of the User Case.  Please give the properties and behaviour of the particular material, manufacturing process and/or in-service-behaviour to be simulated.  No information on the modelling should appear here. The idea is that this user-case can also be simulated by others with other models and that the results can then be compared.",
    "overview_chain":          "Please identify the first model. Note these are assumed to be physics-based models unless it is specified differently.  Most modelling projects consist of a chain of models, (workflow). Here only the Physics Equations should be given and only names appearing in the content list of the Review of Materials Modelling VI should be entered. This review is available on http://ec.europa.eu/research/industrial_technologies/e-library.cfm).All models should be identified as electronic, atomistic, mesoscopic or continuum.",
    "overview_publication":    "Please give the publication which documents the data of this ONE simulation.  This article should ensure the quality of this data set (and not only the quality of the models).",
    "overview_access":         "Please list whether the model and/or data are free, commercial or open source. Please list the owner and the name of the software or database (include a web link if available).",
    "overview_workflow":       "Please give a textual rationale of why you as a modeller have chosen these models and this workflow, knowing other modellers would simulate the same end-user case differently.  This should include the reason why a particular aspect of the user case is to be simulated with a particular model.",
    "aspect_aspect":           "Describe the aspects of the User Case textually.  No modelling information should appear in this box. This case could also be simulated by other models in a benchmarking operation!  The information in this chapter can be end-user information, measured data, library data etc. It will appear in the pink circle of your workflow picture.  Simulated input which is calculated by another model should not be included (but this input is listed in chapter 2.4). Also the result of pre-processing necessary to translate the user case specifications to values for the physics variables of the entities can be documented here.",
    "aspect_material":         "Chemical composition,....", 
    "aspect_geometry":         "Size, form, picture of the system (if applicable) Note that computational choices like simulation boxes are to be documented in chapter 3.",
    "aspect_timelapse":        "Duration of the User Case to be simulated. This is the duration of the situation to be simulated. This is not the same as the computational times to be given in chapter 3.",
    "aspect_manufacture":      "If relevant, please list the conditions to be simulated (if applicable).  E.g. heated walls, external pressures and bending forces.  Please note that these might appear as terms in the PE or as boundary and initial conditions, and this will be documented in the relevant chapters.",
    "aspect_publication":      "Publication documenting the simulation with this single model and its data (if available and if not already included in the overall publication).", 
    "generic_type":            "Model type and name chosen from RoMM content list (the PE).  This PE and only this will appear in the blue circle of your workflow picture. Please do not insert any other text although an indication of the MR is allowed.",
    "generic_entity":          "The entity in this materials model is <finite volumes, grains, atoms, or electrons> ",
    "generic_pe":              "Name, description and mathematical form of the PE In case of tightly coupled PEs set up as one matrix which is solved in one go, more than one PE can appear.",
    "generic_pe_q":            "Please name the physics quantities in the PE, these are parameters (constants, matrices) and variables that appear in the PE, like wave function, Hamiltonian, spin, velocity, external force.",
    "generic_mr":              "Please, give the name of the Material Relation and which PE it completes.",
    "generic_mr_q":            "Please give the name of the physics quantities, parameters (constants, matrices) and variables that appear in the MR(s)",
    "generic_sim_input":       "Please document the simulated input and with which model it is calculated.iThis box documents the interoperability of the models in case of sequential or iterative model workflows. Simulated output of the one model is input for the next model.  Thus what you enter here in 2.4 will also appear in 4.1 of the model that calculated this input.  If you do simulations in isolation, then this box will remain empty.  Note that all measured input is documented in chapter 1 “User Case”.",
    "solver_numerical_solver": "Please give name and type of the solver.  E.g. Monte Carlo, SPH, FE, …iterative, multi-grid, adaptive,...",
    "solver_software_tool":    "Please give the name of the code and if this is your own code, please specify if it can be shared with an eventual link to a website/publication.",
    "solver_time_step":        "If applicable, please give the time step used in the solving operations.  This is the numerical time step and this is not the same as the time lapse of the case to be simulated (see 1.4)",
    "solver_pe_repres":        "Computational representation of the Physics Equation, Materials Relation and material.  There is no need to repeat User Case info. “Computational” means that this only needs to be filled in when your computational solver represents the material, properties, equation variables, in a specific way.",
    "solver_bc":               "If applicable.  Please note that these can be translations of the physical boundary conditions set in the User Case or they can be pure computational like e.g. a unit cell with mirror b.c. to simulate an infinite domain.",
    "solver_pars":             "Please specify pure internal numerical solver details (if applicable), like specific tolerances, cut-off, convergence criteria, integrator options, etc.",
    "proc_output":             "Please specify the output obtained by the post processing.  If applicable then specify the entity in the next model in the chain for which this output is calculated: electrons, atoms, grains, larger/smaller finite volumes.  In case of homogenisation, please specify the averaging volumes.  Output can be calculated values for parameters, new MR and descriptor rules (data-based models).",
    "proc_methods":            "Please describe the mathematics and/or physics used in this post-processing calculation.  In homogenisation this is volume averaging. But also physics equations can be used to derive e.g. thermodynamics quantities or optical quantities from Quantum Mechanics raw output.",
    "proc_margin_error":       "Please specify the margin of error (accuracy in percentages) of the property calculated and explain the reasons to an industrial end-user.",
    "models_help":              "Each physics-based model used in this simulation is to be documented in four chapters: <ul> <li> Aspect of the User Case or system simulated with this model </li> <li> Model: Please make sure the notions Physics Equation and Materials Relation are properly understood. </li> <ol> <li> Tightly coupled models can be written up collectively in one set of four tables. To solve tightly coupled PE one matrix is set up and solved in one go.</li> <li>  For continuum models the PE is often the conservation equations coded up in bought software packages. </li> <li>  Often the MR is established by the modeller.</li> <li>  Computational aspects include also a documentation of how the user case specifications are translated into computer language.</li> <li>  Post processing documents how the raw output of one simulation is processed into input for the next simulation. This information given under 4.1 in the first model will be the same as the <i>simulated input<i> information under 2.4 for the next model. This is the essence of model inter-operability!</li> <li>  Pre-processing before the first model can be depicted in pink as it is considered to be part of the user-case.</li> </ol> <li> Each data-based model in this simulation is to be documented in three chapters:</li> <ol> <li>Aspect of the User Case or system simulated with this data-based model </li> <li>. Data-based Model</li> <li> Computational detail of the datamining operation</li> </ol> </ul>",
   "raw_output":                "<i>The “raw output” calculated by the model is per definition values for the physics variable in the PE(s). This variable is already specified in2.2 and will appear in your dark green circle in the workflow picture.  This raw output is often processed •  to calculate values for physics variables for different entities that can be input to the next model. the output is homogenised for larger volumes •  the output is processed in the form of a MR for the next model •  the output are processed into a  Descriptor Rule that is the final output of the total simulation.  This processed output will appear in your light green circle in the workflow picture and also in 2.4 of the next model.  The methodology (often  including physics) used to do this calculation is to be documented in 4.2)</i>",
   "pe_input":                  "<i> Please either enter each PE as LaTeX, or cut and paste from Microsoft Word or your favourite word processor as a <code>MathML</code>. Instructions are here:  <a href='https://stemreader.org.uk/support/copy-word-equation/' target='_blank'>Here (opens in new page)</a>",
};

// model names (according to the RoMM) and their (user) description.  
models = [];
models_descriptions=[];

jQuery(document).ready(moda_draft_init);

function _eid(x){
	return document.getElementById(x);
}
// functions to change the styles
function O(i) { return typeof i == 'object' ? i : document.getElementById(i) }
function S(i) { return O(i).style }
function C(i) { return document.getElementsByClassName(i) }

function insertAfter(newNode, referenceNode) {
   // since there is only insertbefore, we emulate the after here.. .
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addFormElement(parentId, elementTag, elementId, props) {
   // Adds a form element to the document and appends to the parent, can be used for non forms too...
   // elementTag: like input, textarea etc...
   // props is an associaive array of property:value to b assigned to the new element. 
   
   var p = document.getElementById(parentId);
   var newElement = document.createElement(elementTag);
   newElement.setAttribute('id', elementId);
   for (prop in props) 
   {  
      if (prop=="innerHTML" || elementTag == "textarea" && prop =="value" )
         {
             newElement.innerHTML=props[prop];
         }
      else
         {
               newElement.setAttribute(prop, props[prop]);
         } 
   }
   p.appendChild(newElement);
   if (elementTag =="button") newElement.setAttribute("type", "button");
   if (_eid(elementId) != null ) {
      return elementId;
   }
      else
   {
      return null;
   }
}

function addElement(parentId, elementTag, elementId, html) {
   // Adds an element to the document
   // elementTag: like p, h1, etc.. 
   var p = document.getElementById(parentId);
   var newElement = document.createElement(elementTag);
   newElement.setAttribute('id', elementId);
   newElement.innerHTML = html;
   p.appendChild(newElement);
}

function removeElement(elementId) {
   // Removes an element from the document
   var element = document.getElementById(elementId);
   element.parentNode.removeChild(element);
}

function addPeElement(pdiv, pe ) {
   // add equation element, not only PE, but also MR, MRQ, PEQ
   var n = current_model_number;
   pe_count[n]+=1;
   i=pe_count[n];
   myDiv=pdiv +"_"+i;
   addElement(pdiv, 'li', myDiv, ' ');

    if (arguments.length > 2 ) 
    {
        var field_value = ['myName', 'myDescription', 'myEquation'];
    }
    else
    {
        var field_value = [pe+"N["+(Number(n)-1)+"]["+i+"]", pe+"D["+(Number(n)-1)+"]["+i+"]", pe+"F["+(Number(n)-1)+"]["+i+"]",  pe+"fMl["+(Number(n)-1)+"]["+i+"]"];
    }

   _eid(myDiv).innerHTML += '<label>Name</label> ';
   props = {
      'type': 'text',
      'name': pe+"N["+(Number(n)-1)+"][]",
      'placeholder': '',
      'value':    field_value[0], 
   };
   addFormElement(myDiv, 'input', pdiv+'_n_'+i, props);

   _eid(myDiv).innerHTML += '<label>Short Description</label>';
   props = {
      'type': 'text',
      'name': pe+"D["+(Number(n)-1)+"][]",
      'placeholder': 'short description',
      'value': field_value[1],
   };
   addFormElement(myDiv, 'input', pdiv+'_d_'+i, props);

      // add onclick activate the ML sanitization and paste into the fMl
   _eid(myDiv).innerHTML += '<label>Equation (Paste MathML from Word)</label> ';
   props = {
      'maxLength':   50000,
      "height":      "50px",
      'name': pe+"F["+(Number(n)-1)+"][]",
      'placeholder': 'Paste math formula from Word (MathML) and press tab',
      'wrap': 'soft',
      'onChange':  'javascript:updateMath(\'' + pdiv + '_fMl_' + i + '\', \''+pdiv+'_f_' + i + '\', \''+pdiv+'_fd_' + i + '\')',
      'value':      field_value[2],
  };               
  addFormElement(myDiv, 'textarea', pdiv+'_f_'+i, props);

  props = {
    'maxLength': 50000,
    "height":    "100px",
      'name': pe+"fMl["+(Number(n)-1)+"][]",
    'placeholder': '',
    'wrap': 'soft',
    'value':    field_value[3],
  };
  addFormElement(myDiv, 'textarea', pdiv+'_fMl_'+i, props);

  addElement(myDiv, 'li', pdiv+'_fd_'+i, ' ');

   //_eid(pdiv+'_fd_'+i).style.display="none";
   _eid(pdiv+'_fMl_'+i).style.display="none";
   _eid(myDiv).innerHTML += '<br />';
   props = {
      'innerHTML': 'Remove',
      'onclick': "javascript:removePeElement('" + myDiv + "')",
   }
   addFormElement(myDiv, 'button', pdiv+'_b2', props);
}

function removePeElement (pediv) {
  _eid(pediv).parentNode.removeChild(_eid(pediv));
}

function updateMath (elementIdTarget, elementIdSource, elementDisplayTargetId) {
   // update the mml from the source to the arget textareas and print it then hide the textareas 
   var m = _eid(elementIdSource).value;
   m=m.replace(/mml:/g, "");
   //m=m.replace(/:mml/g, "");
   //m=m.replace(/xmlns:m=\"http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/math\"/g, "");
   //_eid("bug").innerHTML += m;

   _eid(elementIdTarget).value = m;
   _eid(elementIdSource).value = m;
   _eid(elementDisplayTargetId).innerHTML = m;
  // _eid(elementDisplayTargetId).style.display="block";
   _eid(elementIdTarget).style.display = "none";
   _eid(elementIdSource).style.display = "none";
}





function rommPE () {
// here is the function to return a selection list with all models, 
// prefferiably this would be an external function that is based on the 
// extracted table of contents. 
// check the function below for the entities, this can be extended to the pe's. 
// i.e., adding options to a <select> element. See also the example in the shared folder. 
}

function setModelType() {
   // returns the value (type) of the model chosen in the select item in the overview section
   // these are constrained to the PE in the RoMM. 
   var e = _eid("select_model").value;
   return e;
}

function removeModel(elementId) {
   // placeholder for the function that removes a model. It should be invoked by updateModelSections after each 
   // time the user moves away from the overview. 
   var result = confirm("Really delete this model? It will delete all subsequent model sections that you have already filled!");
   if (result) {
    removeElement (elementId);
   }
}


function processOverviewOfTheSimulation (){
    models=[];
    models_descriptions = [];
    // get the models entered by the form into the JS.
    var y= document.getElementsByName('romm_name[]');
    for (i=0; i<y.length; i++) {
        models[i] = y[i].value;   
    }
    var y= document.getElementsByName('model_description[]');
    for (i=0; i<y.length; i++) {
        models_descriptions[i] = y[i].value;   
    }
    updateModelSections(); 
    // make overview section readonly now!
}

function updateModelSections () {
   if (models.length == 0) 
   {
      _eid("message").innerHTML = "Please define some models first before proceeding!";
   }
   else 
   {
        // make the model selections readonly
        jQuery("select[name='romm_name[]']").prop("readonly", true);      
        
        for (imodel = 0; imodel< models.length; imodel++) 
        {
            createModelSections(imodel+1); // model numbers start at 1
        }
        // now after all models have been created, we show first section of first model. 
        showPhase(1, "aspect"); 
   }
}

function createModelSections(model_number) {
   
   setCurrentModel(model_number); 

   // current_model_section_id is the id of the div encompassing all 4 subsections of this model. 
   current_model_section_id = modelMainSectionId(current_model_number);  

   if (existElement (current_model_section_id) == false )
   {
      // add a separate div for each model under the form. 
      addElement ("moda_form", "div", current_model_section_id, " ");

      // add a main title for this model section (for each model another title)
      addElement (current_model_section_id,  "h1", modelMainSectionTitleId(current_model_number), "Physics Based    ");
      _eid(modelMainSectionTitleId(current_model_number)).innerHTML += "Model "+current_model_number+": "+models[current_model_number-1];

      // Begin of Model subsections: Aspects, generic, computational, and post 
      //=====================================
      createAspectsSection();
      createGenericSection();
      createSolverSection();
      createProcSection();
      
   }
   else
   {
       // here comes the logic to update if some models are deleted/added
   }
}

function modelMainSectionId(n) {
   // to make sure we always have the same id for each section!
   return modaId("model", n, "div");
}

function modelMainSectionTitleId(n) {
   return modaId("model", n, "main_section_title");
}

function modelAspectTitleId(n) {
   return modaId("model", n, "aspect_title");
}
function modelAspectId(n) {
   return modaId("model", n, "aspect");
}
function modelAspectInputId(n) {
   return modaId("model", n, "aspect_input");
}
function modelMaterialId(n) {
   return modaId("model", n, "material");
}
function modelMaterialInputId(n) {
   return modaId("model", n, "material_input");
}
function modelGeometryId(n) {
   return modaId("model", n, "Geometry");
}
function modelGeometryInputId(n) {
   return modaId("model", n, "geometry_input");
}
function modelTimeLapseId(n) {
   return modaId("model", n, "TimeLapse");
}
function modelTimeLapseInputId(n) {
   return modaId("model", n, "TimeLapse_input");
}
function modelManufactureId(n) {
   return modaId("model", n, "manufacture");
}
function modelManufactureInputId(n) {
   return modaId("model", n, "manufacture_input");
}
function modelModelPublicationId(n) {
   return modaId("model", n, "model_publication");
}
function modelModelPublicationInputId(n) {
   return modaId("model", n, "model_publication_input");
}
function aspectDiv(n) {
   return modaId("model", n, "aspect_div");
}
function genericDiv(n) {
   return modaId("model", n, "generic_div");
}
function genericTitleId(n) {
   return modaId("model", n, "generic_title");
}
function genericTypeId(n) {
   return modaId("model", n, "generic_type");
}
function genericTypeInputId(n) {
   return modaId("model", n, "generic_type_input");
}
function genericEntityId(n) {
   return modaId("model", n, "generic_entity");
}
function genericEntityInputId(n) {
   return modaId("model", n, "generic_entity_input");
}
function genericPeQId(n) {
   return modaId("model", n, "generic_pe_q");
}
function genericPeQHelpId(n) {
   return modaId("model", n, "generic_pe_q_help");
}
function genericPeDivId(n) {
   return modaId("model", n, "generic_pe_div");
}
function genericQDivId(n) {
   return modaId("model", n, "generic_q_div");
}




function setPeInputIds (m_number, pe_number ) {
   // We need one uniqe name/id for each div, name, description and formula of each
   // PE according to: model_X_PE_Y_{name, description, formula} where X is
   // current model number and Y is the current PE of this model.  The DIV will
   // have the tag: model_X_PE_Y_div, and all will be created by this function
   // that returns the correct ids in an array with div, name, desc, formula
   // element
   var ids = new Array ();
   var postfix = "model_"+m_number+"_PE_"+pe_number+"_";
   ids[0] = postfix+"div";
   ids[1] = postfix+"name";
   ids[2] = postfix+"description";
   ids[3] = postfix+"formula";

}

function createAspectsSection() {
      current_div_id = modaId("model", current_model_number, "aspect_div");
      addElement (current_model_section_id, "div", current_div_id, "");

      addElement (current_div_id, "h1", modelAspectTitleId(current_model_number), "1. Aspect of the User Case/System to be Simulated");
      S(modelAspectTitleId(current_model_number)).backgroundColor="#daa1a0";

      // Aspects of the user case to be simulated
      addElement (current_div_id, "label", modelAspectId(current_model_number), "Aspect of the User Case to be Simulated");

      // the attributes of the textarea:
      props = {
         "maxLength":   2000,
         'name':        "aspect_user_case[]",
         "placeholder": placeholders["aspect_aspect"],
         "wrap":        "soft",  
         "innerHTML":   "test",
      };
      addFormElement (current_div_id, "textarea", modelAspectInputId(current_model_number), props);

      // Materials
      addElement (current_div_id, "label", modelMaterialId(current_model_number), "Material(s)");
      props = {
         "maxLength":   2000,
         'name':        "material[]",
         "placeholder": placeholders["aspect_material"],
         "wrap":        "soft",  
         "innerHTML":   "test",
      };
      addFormElement (current_div_id, "textarea", modelMaterialInputId(current_model_number), props);
//      _eid(modelMaterialInputId(current_model_number)).readOnly=true;

      // Geometry
      addElement (current_div_id, "label", modelGeometryId(current_model_number), "Geometry");
      props = {
         "maxLength":   2000,
         'name':        "geometry[]",
         "placeholder": placeholders["aspect_geometry"],
         "wrap":        "soft",  
         "value":       "geometry",
         "innerHTML":   "test",
      };
      addFormElement (current_div_id, "textarea", modelGeometryInputId(current_model_number), props);

      
      // Time Lapse
      addElement (current_div_id, "label", modelTimeLapseId(current_model_number), "Time Lapse");
      props = {
         "maxLength":   500,
         "height":      "50px",
         'name':        "time_lapse[]",
         "placeholder": placeholders["aspect_timelapse"],
         "wrap":        "soft",  
         "innerHTML":   "test",
      };
      addFormElement (current_div_id, "textarea", modelTimeLapseInputId(current_model_number), props);

      //Manufacturing Process or in-Service Conditions
      addElement (current_div_id, "label", modelManufactureId(current_model_number), "Manufacturing Process or in-Service Conditions");
      props = {
         "maxLength":   2000,
         'name':        "manufacture[]",
         "placeholder": placeholders["aspect_manufacture"],
         "wrap":        "soft",  
         "innerHTML":   "test",
      };
      addFormElement (current_div_id, "textarea", modelGeometryInputId(current_model_number), props);

      // Publication on this Data
      addElement (current_div_id, "label", modelModelPublicationId(current_model_number), "Publication on this Data");
      props = {
         "maxLength":   2000,
         'name':        "publication_on_model[]",
         "value":       "publication",
         "placeholder": placeholders["aspect_publication"],
         "wrap":        "soft",  
         "innerHTML":   "test",
      };
      addFormElement (current_div_id, "textarea", modelModelPublicationInputId(current_model_number), props);
      S(modelModelPublicationInputId(current_model_number)).height="100px";
}

function createGenericSection () {

      // The overview section for this model
      //=====================================
      current_div_id = modaId("model", current_model_number, "generic_div");
      addElement (current_model_section_id, "div", current_div_id , "<hr>");

      // the tile of the section
      addElement (current_div_id , "h1", genericTitleId(current_model_number), "2.Generic Physics of the Model Equation");
      S(genericTitleId(current_model_number)).backgroundColor="rgb(149,179,215)";

      // Model Type and Name
      addElement (current_div_id, "label", genericTypeId(current_model_number), "Model Type and Name (from the overview section)");

      // the attributes of the input, here we fix it:
      props = {
         "type":        "text",
         'name':        "model_type[]",
         "placeholder": placeholders["generic_type"],
         "value":       models[current_model_number-1],
         "readonly":    "true",
      };
      addFormElement (current_div_id, "input", genericTypeInputId(current_model_number), props);

      // Model entity
      addElement (current_div_id, "label", genericEntityId(current_model_number), "Model Entity (should be determined from the model type, please consult the RoMM)");
      props = {
         'name':        "entity[]",
         "value":       "atomistic",
      };
      addFormElement (current_div_id, "select", genericEntityInputId(current_model_number), props);
      // populate the options
      // these are "text":"value" pairs
      labels_values= {
                        "Electronic" : "Electronic", 
                        "Atomistic": "Atomistic", 
                        "Mesoscopic":"Mesoscopic", 
                        "Continuum Volume":"Continuum Volume"
                     };  

      for (choice in labels_values)
          {
            props = {
                      "innerHTML":   choice,
                      "value":       labels_values[choice],
                     } 
         addFormElement(genericEntityInputId(current_model_number), "OPTION", choice, props);
         }


      // MODEL PHYSICS/ CHEMISTRY EQUATION PE

      addElement (current_div_id, "label", genericPeQId(current_model_number), "Model Physics/Chemistry Equations (PE)");

      // show help in a separate div on how to paste formulas 
      addElement (current_div_id, "div", genericPeQHelpId(current_model_number), placeholders["pe_input"]);
      _eid(genericPeQHelpId(current_model_number)).innerHTML += '<br /> '+ placeholders["generic_pe"] +'<br />'
      _eid(genericPeQHelpId(current_model_number)).innerHTML += '<br /> '+ placeholders["generic_pe_q"] +'<br />'
      _eid(genericPeQHelpId(current_model_number)).innerHTML += '<br /> '+ placeholders["generic_mr"] +'<br />'
      _eid(genericPeQHelpId(current_model_number)).innerHTML += '<br /> '+ placeholders["generic_mr_q"] +'<br />'

      _tmp = modaId("model", current_model_number, "generic_pe_div");
      addElement (current_div_id, "ol", _tmp, "<h2>Physics Equations</h2>");
 
      pediv = _tmp; // all equations of this model go under this div. model_n_generic_pe_div
      // add an add pysics equation button
      props = {
               'innerHTML': 'Add a Physics Equation',
               'onclick': "javascript:addPeElement('"+pediv+"','PE')",
               'display': 'inline-block',
               };
      addFormElement(pediv, 'button', 'b_'+current_model_number, props);
      

      addPeElement(pediv,'PE', "name");
   
      // Physical quantities for equations for this model

      _tmp = modaId("model", current_model_number, "generic_peq_div");
      addElement (current_div_id, "ol", _tmp, "<h2>The Physics Quantities for all Physics Equations</h2>");
 
      // add an "add pysics quantity" button
      props = {
               'innerHTML': 'Add a Physics Quantitiy',
               'onclick': "javascript:addPeElement('"+_tmp+"','PEQ')"
               };
      addFormElement(_tmp, 'button', 'bQ_'+current_model_number, props);

      // MATERIALS RELATIONS

      //addElement (current_div_id, "label", modaId("generic",current_model_number, "mr_title"), "Materials Relations");

      _tmp = modaId("model", current_model_number, "generic_mr_div");
      addElement (current_div_id, "ol", _tmp, "<h2>Material Relations</h2>");
 
      // add an add materials relations button
      props = {
               'innerHTML': 'Add a materials relation',
               'onclick': "javascript:addPeElement('"+_tmp+"','MR')"
               };
      addFormElement(_tmp, 'button', 'bMr_'+current_model_number, props);

      // quantities of MR
      addElement (current_div_id, "ol", modaId("generic",current_model_number, "mrq_title"), "<h2>The Phyiscs Quantities for all the Materials Relations</h2>");

      _tmp = modaId("model", current_model_number, "generic_mrq_div");
      addElement (current_div_id, "ol", _tmp, "");
 
      // add an add pysics quantity button
      props = {
               'innerHTML': 'Add a MR Physics Quantitiy',
               'onclick': "javascript:addPeElement('"+_tmp+"','MRQ')"
               };
      addFormElement(_tmp, 'button', 'bMr_'+current_model_number, props);

      // Simulated Input 
   
          
      addElement (current_div_id, "label", modaId("generic", current_model_number, "simulated_title"), "Simulated Input");
      props = {
         "maxLength":   5000,
         'name':        "sim_input[]",
         "placeholder": placeholders["generic_sim_input"],
         "wrap":        "soft",  
         "value":       "simulated input",
      };
      addFormElement (current_div_id, "textarea", modaId("generic", current_model_number, "sim_input"), props);

}
function createSolverSection () {

      current_div_id = modaId("model", current_model_number, "solver_div");
      addElement (current_model_section_id, "div", current_div_id , "<hr>");

      // the tile of the section
      addElement (current_div_id , "h2", modaId("solver", current_model_number, "main_title"), "3. Solver and Computational Translation of the Specifications");
      S(modaId("solver", current_model_number, "main_title")).backgroundColor="rgb(51,153,51)";

      // Numerical solver
      addElement (current_div_id, "label", "", "Numerical Solver");
      props = {
         "maxLength":   5000,
         'name':        "solver[]",
         "placeholder": placeholders["solver_numerical_solver"],
         "wrap":        "soft",  
         "value":        "numerical solver",  
      };
      addFormElement (current_div_id, "textarea", modaId("solver", current_model_number, "solver_input"), props);

      // softwar tool
      myId = modaId("solver", current_model_number, "software_input");
      addElement (current_div_id, "label", " ", "Software Tool");
      props = {
         "maxLength":   5000,
         'name':        "software_tool[]",
         "placeholder": placeholders["solver_software_tool"],
         "wrap":        "soft",  
         "value":        "software tool",  
      };
      addFormElement (current_div_id, "textarea", myId, props);

      // Time and integration parameters
      myId = modaId("solver", current_model_number, "time_step");
      addElement (current_div_id, "label", "", "Time Steps and Integration Parameters");
      props = {
         "maxLength":   5000,
         'name':        "solver_time_step[]",
         "placeholder": placeholders["solver_time_step"],
         "wrap":        "soft",  
         "value":        "Solver time step",  
      };
      addFormElement (current_div_id, "textarea", myId, props);

      // Time and integration parameters
      myId = modaId("solver", current_model_number, "pe_representation");
      addElement (current_div_id, "label", "", "Computational Representation of the PE, MR and Quantities");
      props = {
         "maxLength":   5000,
         'name':        "comp_rep[]",
         "placeholder": placeholders["solver_pe_repres"],
         "wrap":        "soft",  
         "value":       "computational reprsentation",
      };
      addFormElement (current_div_id, "textarea", myId, props);

      // BC
      myId = modaId("solver", current_model_number, "BC");
      addElement (current_div_id, "label", "", "Computational Boundary Conditions");
      props = {
         "maxLength":   5000,
         'name':        "comp_bc[]",
         "placeholder": placeholders["solver_bc"],
         "wrap":        "soft",  
         "value":       "computational BC",
      };
      addFormElement (current_div_id, "textarea", myId, props);

      // additional solver
      myId = modaId("solver", current_model_number, "solver_pars");
      addElement (current_div_id, "label", "", "Additional Solver Parameters");
      props = {
         "maxLength":   5000,
         'name':        "solver_par[]",
         "placeholder": placeholders["solver_pars"],
         "wrap":        "soft",  
         "value":       "solver parameters",
      };
      addFormElement (current_div_id, "textarea", myId, props);
}


function createProcSection () {

      current_div_id = modaId("model", current_model_number, "proc_div");
      addElement (current_model_section_id, "div", current_div_id , "<hr>");

      // the tile of the section
      addElement (current_div_id , "h2", modaId("proc", current_model_number, "main_title"), "Post Processing");
      S(modaId("proc", current_model_number, "main_title")).backgroundColor="rgb(204, 255, 204)";

      html = "<i>The “raw output” calculated by the model is per definition values for the physics variable in the PE(s). This variable is already specified in2.2 and will appear in your dark green circle in the workflow picture.  This raw output is often processed •  to calculate values for physics variables for different entities that can be input to the next model. the output is homogenised for larger volumes •  the output is processed in the form of a MR for the next model •  the output are processed into a  Descriptor Rule that is the final output of the total simulation.  This processed output will appear in your light green circle in the workflow picture and also in 2.4 of the next model.  The methodology (often  including physics) used to do this calculation is to be documented in 4.2)</i>";
      addElement(current_div_id, "p", "", html);


      addElement (current_div_id, "label", "", "The Processed Output");

      myId = modaId("proc", current_model_number, "proc_output_input");
      props = {
         "maxLength":   5000,
         'name':        "proc_out[]",
         "placeholder": placeholders["proc_output"],
         "wrap":        "soft",  
         "value":       "processed output",
      };
      addFormElement (current_div_id, "textarea", myId, props);

      //method 
      myId = modaId("proc", current_model_number, "method_input");
      addElement (current_div_id, "label", "", "Methodologies");
      props = {
         "maxLength":   5000,
         'name':        "proc_method[]",
         "placeholder": placeholders["proc_methods"],
         "wrap":        "soft",  
         "value":       "post-processing methods",
      };
      addFormElement (current_div_id, "textarea", myId, props);

      myId = modaId("proc", current_model_number, "margin_error");
      addElement (current_div_id, "label", "", "Margin of Error");
      props = {
         "maxLength":   5000,
         'name':        "proc_margin_error[]",
         "placeholder": placeholders["proc_margin_error"],
         "wrap":        "soft",  
         "value":       "post-processing margin of error",
      };
      addFormElement (current_div_id, "textarea", myId, props);

}


jQuery(document).ready( function () {
  jQuery('.add_model_button').click(function(e){ 
        e.preventDefault();
        addExistingModel();
    });

       
    
});

         
function addExistingModel(selected_model, description) {
    html  = ' <fieldset><legend></legend>';
    html += '  <select name="romm_name[]" >';
    html += '     <option none></option>';
    html += '     <option value="DFT">DFT</option> ';
    html += '     <option value="MD" >MD</option>';
    html += '     <option value="CFD" >CFD</option>';
    html += '     <option value="SM" >CFD</option>';
    html += '  </select>';
    html += '<label>Description: <input type="text" size = "40" name="model_description[]"></label>';
    html += '<a href="#" class="remove_field">Remove Model</a></div>';
    html += '</fieldset>';
    $html = jQuery(html);
    $html.find('select').val(selected_model);
    $html.find('input').val(description);
    e=jQuery('.add_select_models_div').append($html);
    jQuery('.add_select_models_div').on("click",".remove_field", function(e){ 
        e.preventDefault(); jQuery(this).parent('fieldset').remove();
    })
    

}




function modaId(prefix, model_number, suffix) {
   // return a unique id for each section of the MODA, using terminology of the
   // MODA itself
   // prefix and suffix are strings 
   // model_number is an integer representing the model number, if 0, then we
   // assume it is the overview section
   return (prefix + "_"+ model_number + "_" + suffix); 
}

function setCurrentModel (n) {
   // global variables
   current_model_number = n;
   //current_model_section_id = modaId("model", n, "section");
}
function existElement(id) {
   // wrapper to the getElementByID..
   if (_eid(id) == null  )
      {
         return false;
      }
   else 
      {
         return true;
      }
}

function submitForm(){
//	_eid("moda_form").method = "post";
//	_eid("moda_form").action = "add_foobar";
//	_eid("moda_form").submit();
}

function showPhase(model_n, section_n) {

   S("overview_section_div").display = "none";
   for (imodel = 0; imodel< models.length; imodel++) 
   {
      model_section_id = modelMainSectionId(imodel+1); 
      _eid(model_section_id).style.display = "none";
   }

   setCurrentModel(model_n); 
   if (model_n == 0 ) 
      {
        current_div_id = "overview_section_div";
      }
   else
   {
      _eid(modelMainSectionId(current_model_number)).style.display = "block";
      
      aspect_id = modaId("model", current_model_number, "aspect_div");
      generic_id= modaId("model", current_model_number, "generic_div");
      solver_id = modaId("model", current_model_number, "solver_div");
      proc_id   = modaId("model", current_model_number, "proc_div");
      S(_eid(aspect_id)).display = "none";
      S(_eid(generic_id)).display = "none";
      S(_eid(solver_id)).display = "none";
      S(_eid(proc_id)).display = "none";

      switch (section_n)
      {  
         case "aspect":
            current_div_id = modaId("model", current_model_number, "aspect_div");
         break;
         case "generic":
            current_div_id = modaId("model", current_model_number, "generic_div");
         break;
         case "solver":
            current_div_id = modaId("model", current_model_number, "solver_div");
         break;
         case "proc":
            current_div_id = modaId("model", current_model_number, "proc_div");
         break;
      }
   }
  // create button to next and previous sections. 
  // this is ad-hoc, we need a better way. 
   switch (section_n)
      {
         case "aspect":
            if (current_model_number == 1) {
               proc="";
            }
            else
            {
               proc="proc";
            }
            addNav(current_div_id, (current_model_number-1), proc, "Back");
            addNav(current_div_id, current_model_number, 'generic', "Next");
         break; 
         case "generic":
            addNav(current_div_id, current_model_number, 'aspect', "Back");
            addNav(current_div_id, current_model_number, 'solver', "Next");
         break; 
         case "solver":
            addNav(current_div_id, current_model_number, 'generic', "Back");
            addNav(current_div_id, current_model_number, 'proc', "Next");
         break; 
         case "proc":
            addNav(current_div_id, current_model_number, 'solver', "Back");
            if (current_model_number < models.length) 
               {
                  addNav(current_div_id, Number(current_model_number)+1, 'aspect', "Next");
               }
               else
               {
/*                     if (_eid("submitButton") == null ) {
                        props = {
                        'innerHTML': "Save Your MODA",
                        'onclick': "javascript:submitForm()",
                        }
                        addFormElement(current_div_id, 'button', "submitButton", props);
                     }*/

               }
         break; 
      }
    

   _eid(current_div_id).style.display = "block";
   _eid("save_button").scrollIntoView();

}


function addNav (divid, model_n, section_n, txt) {
   if (_eid(txt+divid) == null ) {
      props = {
         'innerHTML': txt,
         'onclick': "javascript:showPhase('"+model_n+"', '"+section_n+"')",
      }
      addFormElement(divid, 'button', txt+divid, props);
   }
}

function test_jQuery_ajax_js() {
    jQuery(document).ready( function($) {

        $.ajax({
            url: "http://localhost",
            success: function( data ) {
                alert( 'Your home page has ' + $(data).find('div').length + ' div elements.');
            }
        })

    })
}

function moda_draft_init () {
    $moda_form=jQuery( '#moda_form');
    $moda_form.on('submit', form_handler);
}

function form_handler (evt) {
   evt.preventDefault();
   var serialized_data = $moda_form.serialize();
   post_ajax(serialized_data);
}

function post_ajax(serial_data) {
    var post_data = { 
        action     : 'save_draft_in_DB',
        moda_id    : moda_id,
        nonce      : ajax_object.nonce,
        serialized : serial_data,
    };

    jQuery.post( ajax_object.ajax_url, post_data, ajax_response, 'json' );
};

function ajax_response (response_data) {
    if (response_data.success ) {
        alert ( response_data.data.script_response +  response_data.data.moda_id);
        // set the moda_id, so next time we know which moda we are updating. 
        moda_id = response_data.data.moda_id;
    } else {
        alert ('ERROR' );
    }

}

