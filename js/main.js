// const COLOR_SLOT = "rgb(255,255,255)";
//const COLOR_PHASE_BACKGROUND = "rgb(158,200,216)";
const COLOR_PHASE_BACKGROUND = "#e6ee9c";
const COLOR_PHASE_ACTIVE = "#c0ca33";


var heatmap;

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
    var text = " minute restante";
    if (tempsRestant > 120) {
        tempsRestant = (tempsRestant / 24).toFixed(1);
        if (tempsRestant > 1) {
            text = " heures restantes";
        } else {
            text = " heure restante";
        }
    } else if (tempsRestant > 1) {
        text = " minutes restantes";
    }
    return tempsRestant + text;
}

function toggleMachine(toggleID) {
    var toggle = document.getElementById(toggleID);
    var machineID = toggleID.replace("toggle", "");
    if (toggle !== null) {
        console.log("toggle" + machineID, toggle.checked);
        console.log("#" + machineID + ".closed_machine");
        if (toggle.checked === true) {
            console.log("JE CACHE");
            document.querySelector("#" + machineID + ".closed_machine").style.visibility = "hidden";
        } else {
            console.log("JE MONTRE");
            document.querySelector("#" + machineID + ".closed_machine").style.visibility = "visible";
        }
    }
}

function loadData(){
    var rawData ={};
    loadJSON(function (response) {
        rawData = JSON.parse(response);

        var machines = rawData.machine;

        var col_names = document.getElementById("col_names");
        var col_slots = document.getElementById("col_slots");
        var col_prep = document.getElementById("col_prep");

        var machineID, machine;
        var nameWrap, nameDiv, name;
        var closeMachineToggle, closed_machine;
        var slots_machine, iSlot, slot;
        var prepDiv, iPrepSlot, slotPrep;
        var iOF, OF, realOF, OFDiv, mySlot;
        var phases, phaseID, phase, phaseDiv, slotDiv;
        var i;

        //load machines
        for (machineID in machines) {
            if (machines.hasOwnProperty(machineID)) {
                machine = machines[machineID];

                //machine
                nameWrap = document.createElement("div");
                nameDiv = document.createElement("div");
                nameWrap.appendChild(nameDiv);
                col_names.appendChild(nameWrap);
                name = document.createElement("span");
                if(machine.emplacement_max > 4){
                    nameDiv.setAttribute("class", "machine");
                    nameWrap.setAttribute("class", "nameWrap-large");
                }else{
                    nameDiv.setAttribute("class", "machine");
                    nameWrap.setAttribute("class", "nameWrap");
                }
                name.setAttribute("class","name");
                name.innerHTML = machine.id;
                nameDiv.appendChild(name);
                closeMachineToggle = document.createElement("input");
                nameDiv.innerHTML += "<br>";
                closeMachineToggle.setAttribute("checked", "");
                closeMachineToggle.setAttribute("data-toggle", "toggle");
                closeMachineToggle.setAttribute("type", "checkbox");
                closeMachineToggle.setAttribute("data-on", "Activée");
                closeMachineToggle.setAttribute("data-off", "Désactivée");
                closeMachineToggle.setAttribute("data-onstyle", "success");
                closeMachineToggle.onchange = function () {
                    toggleMachine(this.id);
                };
                closeMachineToggle.setAttribute("id", "toggle" + machineID);
                nameDiv.appendChild(closeMachineToggle);

                slots_machine = document.createElement("div");
                slots_machine.setAttribute("id", "slots_machine" + machineID);
                col_slots.appendChild(slots_machine);
                if(machine.emplacement_max > 4){
                    slots_machine.setAttribute("class", "col-md-12 slots_machine machine-large");
                }else{
                    slots_machine.setAttribute("class", "col-md-12 slots_machine");
                }
                for (iSlot = 0; iSlot < machine.emplacement_max; iSlot++) {
                    slot = document.createElement("div");
                    slot.setAttribute("class", "slot col-md-3");
                    slot.setAttribute("id", machine.id + "_" + iSlot);
                    slots_machine.appendChild(slot);
                }
                closed_machine = document.createElement("div");
                closed_machine.setAttribute("class", "closed_machine text-center");
                closed_machine.setAttribute("id", machineID);
                closed_machine.style.visibility = "hidden";
                closed_machine.innerHTML = "<h1>Fermée</h1>";
                slots_machine.appendChild(closed_machine);

                prepDiv = document.createElement("div");
                col_prep.appendChild(prepDiv);
                prepDiv.id = machineID + "_prep";
                if(machine.emplacement_max > 4){
                    prepDiv.setAttribute("class", "col-md-12 slots_prepa cell-large");
                }else{
                    prepDiv.setAttribute("class", "col-md-12 slots_prepa");
                }
                for (iPrepSlot = 0; iPrepSlot < 2; iPrepSlot++) {
                    slotPrep = document.createElement("div");
                    slotPrep.setAttribute("class", "slot col-md-6");
                    slotPrep.setAttribute("id", machine.id + "_prep_" + iPrepSlot);
                    prepDiv.appendChild(slotPrep);
                }

                //OFs
                for (iOF = 0; iOF < machine.emplacement.length; iOF++) {
                    OF = machine.emplacement[iOF];
                    realOF = rawData.OF[OF[0]];
                    OFDiv = document.createElement("div");
                    OFDiv.setAttribute("class", "OF draggable");
                    OFDiv.setAttribute("id", OF[0]);
                    OFDiv.setAttribute("priority", realOF.priorite);
                    OFDiv.innerHTML = OF[0] + " " + realOF.article + "  " + realOF.phase_en_cours + "<br>" + OF[1] + " jour(s)";

                    mySlot = document.getElementById(machine.id + "_" + iOF);
                    mySlot.appendChild(OFDiv);

                    if (machine.OF_en_cours === OF[0] && typeof rawData.OF[OF[0]] !== 'undefined') {
                        var article = rawData.OF[OF[0]].article;
                        var tempsTotal = rawData.Article[article].temps;
                        var percentage =  (machine.temps_passe *100 / tempsTotal).toFixed(2);
                        var tempsRestant = pretifyTempsRestant(tempsTotal, machine.temps_passe);
                        OFDiv.innerHTML += "<br>" + tempsRestant;
                        OFDiv.classList.add('current');
                        percentageChange(OF[0], percentage);
                    }

                }
            }
        }


        phases = rawData.OF;
        //load OFs
        i = 0;
        for (phaseID in phases) {
            if (phases.hasOwnProperty(phaseID)) {
                phase = phases[phaseID];
                if (phase.sur_machine === 0) {
                    phaseDiv = document.createElement("div");
                    phaseDiv.innerHTML = phase.id + " " + phase.article + "  " + phase.phase_en_cours + "<br>" + phase.jours_attente + " jours";
                    phaseDiv.setAttribute("class", "OF");
                    phaseDiv.setAttribute("priority", phase.priorite);

                    slotDiv = document.getElementById("CU_H_" + i); //fixme c'est un hack dégueulasse
                    i++;
                    slotDiv.appendChild(phaseDiv);
                }
            }

        }
    });
}

function trackClick(x, y) {
    console.log("click !!")
    var clicks, currentValue;
    if (getTrackingData("clicks")) {
        clicks = getTrackingData("clicks");
        if (clicks[x]) {
            if (clicks[x][y]) {
                currentValue = clicks[x][y];
                clicks[x][y] = currentValue + 1;
            } else {
                clicks[x][y] = 1;
            }
        } else {
            clicks[x] = {};
            clicks[x][y] = 1;
        }
    } else {
        clicks = {};
        clicks[x] = {};
        clicks[x][y] = 1;
    }
    trackGeneric("clicks", clicks);
}

function removeHeatmap() {
    //find corresponding canvas element
    var canvas = heatmap._renderer.canvas;
    //remove the canvas from DOM
    $(canvas).remove();
    //then unset the variable
    heatmap = undefined;
}

function refreshHeatmap() {
    if (!heatmap) {
        heatmap = h337.create({
            container: document.body
        });
        heatmap.setDataMin(0);
    }

    var clicks, x, y, dataPoint;
    if (getTrackingData("clicks")) {
        clicks = getTrackingData("clicks");
        console.log("clicks : " + JSON.stringify(clicks));
        for (x in clicks) {
            if (clicks.hasOwnProperty(x)) {
                for (y in clicks[x]) {
                    if (clicks[x].hasOwnProperty(y)) {
                        dataPoint = {
                            x: x, // x coordinate of the datapoint, a number
                            y: y, // y coordinate of the datapoint, a number
                            value: clicks[x][y] // the value at datapoint(x, y)
                        };
                        heatmap.addData(dataPoint);
                    }
                }
            }
        }
    }
    heatmap.repaint();
}

function convertDate(date) {
    return date.getFullYear() + "/" + Number(date.getMonth() + 1) + "/" + date.getDate();
}

function trackGeneric(key, value) {
    var retrievedObject;
    var d = new Date();
    var dKey = convertDate(d);
    if (typeof(Storage) !== "undefined") {
        if (!localStorage[dKey]) {
            retrievedObject = {};
        } else {
            retrievedObject = JSON.parse(localStorage[dKey]);
        }
        retrievedObject[key] = value;
        localStorage.setItem(dKey, JSON.stringify(retrievedObject));
    } else {
        // Sorry! No Web Storage support..
    }
}

function getTrackingData(key) {
    var returnValue, retrievedObject;
    var d = new Date();
    var dKey = convertDate(d);
    if (typeof(Storage) !== "undefined" && localStorage[dKey]) {
        retrievedObject = JSON.parse(localStorage[dKey]);
        if (retrievedObject[key]) {
            returnValue = retrievedObject[key];
        }
    }
    return returnValue;
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

function clickEvent(e) {
    trackClick(e.pageX, e.pageY);
}

document.addEventListener('click', clickEvent, true);
loadData();