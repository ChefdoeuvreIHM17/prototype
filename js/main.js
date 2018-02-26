// const COLOR_SLOT = "rgb(255,255,255)";
//const COLOR_PHASE_BACKGROUND = "rgb(158,200,216)";
// const COLOR_PHASE_BACKGROUND = "#e6ee9c";
// const COLOR_PHASE_ACTIVE = "#c0ca33";
const COLOR_PHASE_BACKGROUND = "lightpink";
const COLOR_PHASE_ACTIVE = "deeppink";
const CONST_CDC_SLOTS = 10;

var heatmap;

var planning = {
    "refreshDelayMinutes": 5,
    "rawEnCoursMachine": [],
    "rawEnCoursPrepa": [],
    "CDCs": {}
};

function dragMoveListener(event) {
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

function getCssValuePrefix() {
    var returnVal = '';//default to standard syntax
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++) {
        // Attempt to set the style
        dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

        // Detect if the style was successfully set
        if (dom.style.background) {
            returnVal = prefixes[i];
        }
    }

    dom = null;
    delete dom;

    return returnVal;
}

function percentageChange(id, percentage) {
    document.getElementById(id).style.background = "linear-gradient(90deg, " + COLOR_PHASE_ACTIVE + "  " + percentage + "%, " + COLOR_PHASE_BACKGROUND + " 0%)";
}

function loadJSON(file, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/' + file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
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
    var machineID = toggleID.replace("toggle_", "");
    if (toggle !== null) {
        console.log("toggle" + machineID, toggle.checked);
        console.log("#" + machineID + ".closed_machine");
        if (toggle.checked === true) {
            console.log("JE CACHE");
            document.getElementById("closed_" + machineID).style.visibility = "hidden";
        } else {
            console.log("JE MONTRE");
            document.getElementById("closed_" + machineID).style.visibility = "visible";
        }
    }
}

planning.refreshEnCoursPrepa = function () {
    var rowID, row;
    var rowID2, row2;

    var index_CU_H = 0;
    var index_CU_H_TM = 0;
    var index_CU_H_GC = 0;
    var index_CU_H_GC_TM = 0;
    var index_5AXES = 0;

    //console.log(planning.rawEnCoursPrepa.length);
    for (rowID = 0; rowID < planning.rawEnCoursPrepa.length; rowID++) {
        row = planning.rawEnCoursPrepa[rowID];
        // console.log(rowID, rowID-1);


        if (rowID > 0) {
            // console.log(planning.rawEnCoursPrepa[rowID]["ID_OFS"]);
            // console.log(planning.rawEnCoursPrepa[rowID-1]["ID_OFS"]);

            var cellPrece = planning.rawEnCoursPrepa[rowID]["ID_OFS"];
            var cellCourante = planning.rawEnCoursPrepa[rowID - 1]["ID_OFS"];
            var etatTachePrecedente = planning.rawEnCoursPrepa[rowID - 1]["ETAT_OF"];
            var etatTacheCourante = planning.rawEnCoursPrepa[rowID]["STATUT"];

            //console.log("Tache precedente :"+tachePrecedente);
            // console.log("Tache courante "+tacheCourante);


            if (etatTacheCourante.trim() === "NC" && etatTachePrecedente.trim() === "T" && cellPrece === cellCourante) {
                console.log(row["LIBELLE"]);
            }

            if (cellPrece === cellCourante) {


                switch (row["LIBELLE"]) {
                    case "CU HORIZONTAL":
                        //console.log("CU HORIZONTAL");
                        if (row["TYPE_OF"] !== "") {
                            creation_slot_phase(row, index_CU_H);
                            index_CU_H++;
                        }
                        break;
                    case "CU HORIZONTAL TM":
                        //console.log("CU HORIZONTAL TM");
                        creation_slot_phase(row, index_CU_H_TM);
                        index_CU_H_TM++;
                        break;
                    case "CU HORIZONTAL GC":
                        //console.log("CU HORIZONTAL GC");
                        creation_slot_phase(row, index_CU_H_GC);
                        index_CU_H_GC++;
                        break;
                    case "CU HORIZONTAL GC TM":
                        //console.log("CU HORIZONTAL GC TM");
                        creation_slot_phase(row, index_CU_H_GC_TM);
                        index_CU_H_GC_TM++;

                        break;
                    case "CU 5 AXES":
                        // console.log("CU 5 AXES");
                        creation_slot_phase(row, index_5AXES);
                        index_5AXES++;
                        break;
                }
            }
        }
    }
};

function creation_slot_phase(nom, ite) {
    if (ite < 10) {
        var zone_phase = document.getElementById(nom["LIBELLE"] + "_" + ite);
        var slot_creation = document.createElement('div');
        slot_creation.classList.add("OF");
        slot_creation.classList.add("ui-draggable");
        slot_creation.classList.add("ui-draggable-handle");
        slot_creation.innerHTML = nom["ID_ARTICLE"] + ' ' + nom["ID_OFS"];
        zone_phase.appendChild(slot_creation);
    }
}

planning.loadMachines = function () {
    var reserveDiv = document.getElementById("reserve");
    var col_names = document.getElementById("col_names");
    var col_slots = document.getElementById("col_slots");
    var col_prep = document.getElementById("col_prep");

    var CDC, CDCID, CDCDiv, CDCHeaderDiv, CDCSlotID, CDCSlotDiv;
    var machine, machineID;
    var nameWrapDiv, nameDiv, nameSpan;
    var closeMachineToggle, closed_machine;
    var slots_machine, iSlot, slot, slotID;
    var prep, iPrepSlot, slotPrep;

    loadJSON("machines.json", function (response) {
        planning.CDCs = JSON.parse(response);

        for (CDCID in planning.CDCs) {
            if (planning.CDCs.hasOwnProperty(CDCID)) {

                //////////////// Centre de charge //////////////////
                CDC = planning.CDCs[CDCID];

                CDCHeaderDiv = document.createElement("div");
                CDCHeaderDiv.classList.add("col-md-2");
                CDCHeaderDiv.classList.add("text-center");
                CDCHeaderDiv.classList.add("align-text-center");
                CDCHeaderDiv.id = "header_" + CDCID;
                CDCHeaderDiv.innerHTML = CDCID;

                CDCDiv = document.createElement("div");
                CDCDiv.classList.add("col-md-2");
                CDCDiv.classList.add("slots_machine");
                CDCDiv.id = CDCID;

                for (CDCSlotID = 0; CDCSlotID < CONST_CDC_SLOTS; CDCSlotID++) {
                    CDCSlotDiv = document.createElement("div");
                    CDCSlotDiv.id = CDCID + "_" + CDCSlotID;
                    CDCSlotDiv.classList.add("slot");
                    CDCSlotDiv.classList.add("ui-dropppable");
                    CDCDiv.appendChild(CDCSlotDiv);
                }

                reserveDiv.firstElementChild.appendChild(CDCHeaderDiv);
                reserveDiv.lastElementChild.appendChild(CDCDiv);


                //////////////// Machines //////////////////
                for (machineID in CDC) {
                    if (CDC.hasOwnProperty(machineID)) {
                        machine = CDC[machineID];

                        slots_machine = document.getElementById("slots_machine_" + machineID);
                        if (slots_machine) {
                            // compléter machine si on l'a déjà créée
                            for (iSlot = 0; iSlot < machine.jetons; iSlot++) {
                                slot = document.createElement("div");
                                slot.classList.add("slot");
                                slot.classList.add("col-md-3");
                                if (CDCID.endsWith("TM")) {
                                    slotID = machineID + "_" + iSlot + "_TM";
                                    slot.classList.add("slot_TM");
                                } else {
                                    slotID = machineID + "_" + iSlot;
                                    slot.classList.add("slot_day");
                                }
                                slot.id = slotID;
                                slots_machine.appendChild(slot);
                            }
                        } else {
                            // créer la machine sinon
                            nameWrapDiv = document.createElement("div");
                            nameDiv = document.createElement("div");
                            nameWrapDiv.appendChild(nameDiv);
                            col_names.appendChild(nameWrapDiv);
                            nameSpan = document.createElement("span");
                            if (machine.jetons > 4) {
                                nameDiv.setAttribute("class", "machine");
                                nameWrapDiv.setAttribute("class", "nameWrap-large");
                            } else {
                                nameDiv.setAttribute("class", "machine");
                                nameWrapDiv.setAttribute("class", "nameWrap");
                            }
                            nameSpan.setAttribute("class", "name");
                            nameSpan.innerHTML = machineID;
                            nameDiv.appendChild(nameSpan);
                            closeMachineToggle = document.createElement("input");
                            nameDiv.innerHTML += "<br>";
                            closeMachineToggle.setAttribute("checked", "");
                            closeMachineToggle.setAttribute("data-toggle", "toggle");
                            closeMachineToggle.setAttribute("type", "checkbox");
                            closeMachineToggle.setAttribute("data-on", "Activée");
                            closeMachineToggle.setAttribute("data-off", "Désactivée");
                            closeMachineToggle.setAttribute("data-onstyle", "default");
                            closeMachineToggle.onchange = function () {
                                toggleMachine(this.id);
                            };
                            closeMachineToggle.setAttribute("id", "toggle_" + machineID);
                            nameDiv.appendChild(closeMachineToggle);

                            slots_machine = document.createElement("div");
                            slots_machine.setAttribute("id", "slots_machine_" + machineID);
                            col_slots.appendChild(slots_machine);
                            if (machine.jetons > 4) {
                                slots_machine.setAttribute("class", "col-md-12 slots_machine machine-large");
                            } else {
                                slots_machine.setAttribute("class", "col-md-12 slots_machine");
                            }
                            for (iSlot = 0; iSlot < machine.jetons; iSlot++) {
                                slot = document.createElement("div");
                                slot.classList.add("slot");
                                slot.classList.add("col-md-3");
                                if (CDCID.endsWith("TM")) {
                                    slotID = machineID + "_" + iSlot + "_TM";
                                    slot.classList.add("slot_TM");
                                } else {
                                    slotID = machineID + "_" + iSlot;
                                    slot.classList.add("slot_day");
                                }
                                slot.id = slotID;
                                slots_machine.appendChild(slot);
                            }
                            closed_machine = document.createElement("div");
                            closed_machine.setAttribute("class", "closed_machine text-center");
                            closed_machine.setAttribute("id", "closed_" + machineID);
                            closed_machine.style.visibility = "hidden";
                            closed_machine.innerHTML = "<h1>Fermée</h1>";
                            slots_machine.appendChild(closed_machine);

                            prepDiv = document.createElement("div");
                            prepDiv.id = machineID + "_prep";
                            col_prep.appendChild(prepDiv);
                            if (machine.jetons > 4) {
                                prepDiv.setAttribute("class", "col-md-12 slots_prepa cell-large");
                            } else {
                                prepDiv.setAttribute("class", "col-md-12 slots_prepa");
                            }
                            for (iPrepSlot = 0; iPrepSlot < 2; iPrepSlot++) {
                                slotPrep = document.createElement("div");
                                slotPrep.setAttribute("class", "slot col-md-6");
                                slotPrep.setAttribute("id", machineID + "_prep_" + iPrepSlot);
                                prepDiv.appendChild(slotPrep);
                            }
                        }
                    }
                }

            }
        }
    })
};

planning.resetJetons = function () {
    var CDCID, CDC;
    var machine, machineID;
    for (CDCID in planning.CDCs) {
        if (planning.CDCs.hasOwnProperty(CDCID)) {
            CDC = planning.CDCs[CDCID];
            for (machineID in CDC) {
                if (CDC.hasOwnProperty(machineID)) {
                    machine = CDC[machineID];

                    machine["en-cours"] = 0;
                    machine["a servir cdc"] = 0;
                    machine["a servir global"] = 0;
                    machine["reste a servir"] = 0;

                }
            }
        }
    }
};

planning.refreshEnCoursMachine = function () {
    planning.resetJetons();

    var today = new Date();

    var CDCID, CDC;
    var machine, machineID;
    var rowID, row;
    var slotID, slotDiv;
    var phaseDiv;
    var of, article, phase, datePhase, diff_ms, age, cdc, outillage, cpt_courant;

    for (CDCID in planning.CDCs) {
        if (planning.CDCs.hasOwnProperty(CDCID)) {
            CDC = planning.CDCs[CDCID];
            for (machineID in CDC) {
                if (CDC.hasOwnProperty(machineID)) {
                    machine = CDC[machineID];

                    //récupération de l'en-cours total sur la machine
                    for (rowID in planning.rawEnCoursMachine) {
                        if (planning.rawEnCoursMachine.hasOwnProperty(rowID)) {
                            row = planning.rawEnCoursMachine[rowID];
                            if (row["8"] === machineID && row["9"] === CDCID) { //todo remplacer par LIBELLE et LIBELLE2 quand on aura fix la requête, correspond au nom de la machine et au nom du CDC
                                machine["en-cours"]++;
                            }
                        }
                    }

                    if (machine["jetons"] - machine["en-cours"] < 0) {
                        machine["a servir cdc"] = 0;
                    } else {
                        machine["a servir cdc"] = machine["jetons"] - machine["en-cours"];
                    }
                    machine["reste a servir"] = machine["a servir cdc"];

                    cpt_courant = 0;

                    //affichage de l'en-cours sur la machine
                    for (rowID = 0; rowID < planning.rawEnCoursMachine.length && cpt_courant < machine["a servir cdc"]; rowID++) {
                        if (planning.rawEnCoursMachine.hasOwnProperty(rowID)) {
                            row = planning.rawEnCoursMachine[rowID];
                            if (row["8"] === machineID) { //&& row["9"] === CDCID
                                of = row["ID_OFS"];
                                article = row["ID_ARTICLE"];
                                phase = row["ID_PHASE"];
                                datePhase = Date.parse(row["MIN(HEURE_1.DATE_POINT)"]);
                                diff_ms = today.getTime() - datePhase;
                                age = diff_ms / 86400000; //milisecondes en un jour
                                age = age.toFixed(0);
                                cdc = row["9"].replace("ORIZONTAL", "");
                                outillage = row["REF_OUTILLAGE"];
                                if (outillage.startsWith("STD")) {
                                    outillage.replace("STD", "");
                                } else {
                                    outilllage = "";
                                }

                                slotID = machineID + "_" + cpt_courant;
                                if (CDCID.endsWith("TM")) {
                                    slotID += "_TM";
                                }
                                slotDiv = document.getElementById(slotID);
                                phaseDiv = document.createElement('div');
                                phaseDiv.classList.add("OF");
                                phaseDiv.innerHTML = cdc + "<br>" + of + " " + article + " " + phase + " " + age + " jour(s) " + outillage;
                                slotDiv.appendChild(phaseDiv);
                                cpt_courant++;
                            }
                        }
                    }

                    //s'il reste de la place, appeller du travail
                }
            }
        }
    }

    console.log(JSON.stringify(planning.CDCs, null, 2));
};

function loadData() {
    var rawData = {};
    loadJSON("data.json", function (response) {
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
                if (machine.emplacement_max > 4) {
                    nameDiv.setAttribute("class", "machine");
                    nameWrap.setAttribute("class", "nameWrap-large");
                } else {
                    nameDiv.setAttribute("class", "machine");
                    nameWrap.setAttribute("class", "nameWrap");
                }
                name.setAttribute("class", "name, h3");
                name.innerHTML = machine.id;
                nameDiv.appendChild(name);
                closeMachineToggle = document.createElement("input");
                nameDiv.innerHTML += "<br>";
                closeMachineToggle.setAttribute("checked", "");
                closeMachineToggle.setAttribute("data-toggle", "toggle");
                closeMachineToggle.setAttribute("type", "checkbox");
                closeMachineToggle.setAttribute("data-on", "Activée");
                closeMachineToggle.setAttribute("data-off", "Désactivée");
                closeMachineToggle.setAttribute("data-onstyle", "default");
                closeMachineToggle.onchange = function () {
                    toggleMachine(this.id);
                };
                closeMachineToggle.setAttribute("id", "toggle" + machineID);
                nameDiv.appendChild(closeMachineToggle);

                slots_machine = document.createElement("div");
                slots_machine.setAttribute("id", "slots_machine" + machineID);
                col_slots.appendChild(slots_machine);
                if (machine.emplacement_max > 4) {
                    slots_machine.setAttribute("class", "col-md-12 slots_machine machine-large");
                } else {
                    slots_machine.setAttribute("class", "col-md-12 slots_machine");
                }
                for (iSlot = 0; iSlot < machine.emplacement_max; iSlot++) {
                    slot = document.createElement("div");
                    if (iSlot < 2 || machineID === "Clock1" || machineID === "Clock2") {
                        slot.setAttribute("class", "slot slot_day col-md-3");
                    } else {
                        slot.setAttribute("class", "slot slot_TM col-md-3");
                    }
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
                if (machine.emplacement_max > 4) {
                    prepDiv.setAttribute("class", "col-md-12 slots_prepa cell-large");
                } else {
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
                        var percentage = (machine.temps_passe * 100 / tempsTotal).toFixed(2);
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

planning.refreshData = function (callback) {
    loadJSON("dataEnCoursMachineOld.php", function (response) {
        planning.rawEnCoursMachine = JSON.parse(response);
        loadJSON("dataEnCoursPrepaOld.php", function (response2) {
            planning.rawEnCoursPrepa = JSON.parse(response2);
            callback();
        });
    });
};

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
planning.loadMachines();

planning.refresh = function () {
    planning.refreshData(function () {
        //console.log(JSON.stringify(planning, null, 2));
        planning.refreshEnCoursMachine();
        planning.refreshEnCoursPrepa();
    });
};

window.setInterval(planning.refresh(), planning.refreshDelayMinutes * 60 * 1000);