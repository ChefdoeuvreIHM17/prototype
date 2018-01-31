
const COLOR_SLOT = "rgb(255,255,255)";
const COLOR_PHASE_BACKGROUND = "rgb(158,200,216)";
const COLOR_PHASE_ACTIVE = "rgb(128, 177, 133)";

// target elements with the "draggable" class
/*interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        snap: {
            targets: [
                interact.createSnapGrid({ x: 30, y: 30 })
            ],
            range: Infinity,
            relativePoints: [ { x: 0, y: 0 } ]
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');

            textEl && (textEl.textContent =
                'moved a distance of '
                + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                Math.pow(event.pageY - event.y0, 2) | 0))
                    .toFixed(2) + 'px');
        }
 });*/

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function getCssValuePrefix()
{
    var rtrnVal = '';//default to standard syntax
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++)
    {
        // Attempt to set the style
        dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

        // Detect if the style was successfully set
        if (dom.style.background)
        {
            rtrnVal = prefixes[i];
        }
    }

    dom = null;
    delete dom;

    return rtrnVal;
}


function percentageChange(id, percentage) {
    var gradientString = "linear-gradient(90deg, "+COLOR_PHASE_ACTIVE+"  "+percentage+"%, "+COLOR_PHASE_BACKGROUND+" 0%)";
    document.getElementById(id).style.background = gradientString;
}

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'js/data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function pretifyTempsRestant(tempsTotal, temps_passe) {
    var tempsRestant = tempsTotal - temps_passe;
    var text = " heure restante";
    if (tempsRestant > 1) {
        text = " heures restantes";
    }
    return tempsRestant + text;
}

function loadData(){
    var rawData ={};
    loadJSON(function (response) {
        rawData = JSON.parse(response);

        var machines = rawData.machine;

        var col_names = document.getElementById("col_names");
        var col_slots = document.getElementById("col_slots");
        var col_prep = document.getElementById("col_prep");

        //load machines
        for(var machineID in machines) {
            if (machines.hasOwnProperty(machineID)) {
                var machine = machines[machineID];
                console.log(machine);

                //machine

                var nameDiv = document.createElement("div");
                col_names.appendChild(nameDiv);
                var name = document.createElement("span");
                if(machine.emplacement_max > 4){
                    nameDiv.setAttribute("class", "machine-large");
                }else{
                    nameDiv.setAttribute("class", "machine");
                }
                name.setAttribute("class","name");
                name.innerHTML = machine.id;
                nameDiv.appendChild(name);

                var slots_machine = document.createElement("div");
                col_slots.appendChild(slots_machine);
                if(machine.emplacement_max > 4){
                    slots_machine.setAttribute("class", "col-md-12 slots_machine machine-large");
                }else{
                    slots_machine.setAttribute("class", "col-md-12 slots_machine");
                }
                for (var iSlot = 0; iSlot < machine.emplacement_max; iSlot++) {
                    var slot = document.createElement("div");
                    slot.setAttribute("class", "slot col-md-3");
                    slot.setAttribute("id", machine.id + "_" + iSlot);
                    slots_machine.appendChild(slot);
                }

                var prep = document.createElement("div");
                col_prep.appendChild(prep);
                if(machine.emplacement_max > 4){
                    prep.setAttribute("class", "col-md-12 slots_prepa machine-large");
                }else{
                    prep.setAttribute("class", "col-md-12 slots_prepa");
                }
                for (var iPrepSlot = 0; iPrepSlot < 2; iPrepSlot++) {
                    var slotPrep = document.createElement("div");
                    slotPrep.setAttribute("class", "slot col-md-6");
                    slotPrep.setAttribute("id", machine.id + "_prep_" + iPrepSlot);
                    prep.appendChild(slotPrep);
                }

                //phases
                for (var iPhase = 0; iPhase < machine.emplacement.length; iPhase++) {
                    var phase = machine.emplacement[iPhase];
                    var phaseDiv = document.createElement("div");
                    phaseDiv.setAttribute("class", "phase draggable");
                    phaseDiv.setAttribute("id", phase[0]);
                    phaseDiv.innerHTML = phase[0] + "<br>" + phase[1] + " jour(s)";

                    var mySlot = document.getElementById(machine.id + "_" + iPhase);
                    mySlot.appendChild(phaseDiv);

                    if (machine.phase_en_cours === phase[0] && typeof rawData.Phase[phase[0]] !== 'undefined') {
                        var tempsTotal = rawData.Phase[phase[0]].temps;
                        var percentage =  (machine.temps_passe *100 / tempsTotal).toFixed(2);
                        var tempsRestant = pretifyTempsRestant(tempsTotal, machine.temps_passe);
                        phaseDiv.innerHTML += "<br>" + tempsRestant;
                        percentageChange(phase[0],percentage);
                    }

                }
            }
        }


        var OFs = rawData.OF;
        //load OFs
        var i = 0;
        for (var OFID in OFs) {
            if (OFs.hasOwnProperty(OFID)) {
                var OF = OFs[OFID];
                var OFDiv = document.createElement("div");
                OFDiv.innerHTML = OF.id + " " + OF.phase_en_attente + "  " + OF.numero + "<br>" + OF.jours_attente + " jours";
                if (OF.priorite === 2) {
                    OFDiv.setAttribute("class", "OF AOG");
                } else {
                    OFDiv.setAttribute("class", "OF");
                }

                var slotDiv = document.getElementById("CU_H_" + i); //fixme c'est un hack dégueulasse
                i++;
                slotDiv.appendChild(OFDiv);
            }
        }
    });
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
loadData();