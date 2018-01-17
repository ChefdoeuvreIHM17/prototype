
const COLOR_SLOT = "rgb(255,255,255)";
const COLOR_PHASE_BACKGROUND = "rgb(158,200,216)";
const COLOR_PHASE_ACTIVE = "rgb(128, 177, 133)";

// target elements with the "draggable" class
interact('.draggable')
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
    });

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


function percentageChange(percentage){
    document.getElementById("drag-1").innerText = percentage;
    document.getElementById("drag-1").style.backgroundColor = "red";
    var gradientString = "linear-gradient(90deg, "+COLOR_PHASE_ACTIVE+"  "+percentage+"%, "+COLOR_PHASE_BACKGROUND+" 0%)";
    console.log(gradientString);
    document.getElementById("drag-1").style.background = gradientString;
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

function loadData(){
    var rawData ={};
    loadJSON(function (response) {
        rawData = JSON.parse(response);

        var machines = rawData.machine;

        var col_names = document.createElement("div");
        col_names.setAttribute("class","col-md-2 column");
        var col_slots = document.createElement("div");
        col_slots.setAttribute("class","col-md-6 column");
        var col_prep = document.createElement("div");
        col_prep.setAttribute("class","col-md-4 column");

        //load phases
        for(var machineID in machines) {
            if (machines.hasOwnProperty(machineID)) {
                var machine = machines[machineID];
                console.log(machine);

                /*var row = document.createElement("div");
                row.setAttribute("class", "machine row");

                var title = document.createElement("div");
                title.setAttribute("class", "machine_title col-md-2");
                title.innerHTML = machineID;

                var slots = document.createElement("div");
                slots.setAttribute("class","col-md-6t slot");
                if(machine.emplacement_max > 4){
                    var slotsBis = document.createElement("div");
                    slotsBis.setAttribute("class","col-md-6 slot");
                }

                var preparation = document.createElement("div");
                preparation.setAttribute("class","col-md-4 slot");


                row.appendChild(title);
                row.appendChild(slots);
                if(machine.emplacement_max > 4){
                    row.appendChild(slotsBis);
                }
                row.appendChild(preparation);

                document.getElementById("machine_calls").appendChild(row);

                */

                var nameCell = document.createElement("div");
                var name = document.createElement("span");
                if(machine.emplacement_max > 4){
                    nameCell.setAttribute("class","machine-large");
                }else{
                    nameCell.setAttribute("class","machine");
                }
                name.setAttribute("class","name");
                name.innerHTML = machine.id;
                nameCell.appendChild(name);

                var slot = document.createElement("div");
                if(machine.emplacement_max > 4){
                    slot.setAttribute("class","slot machine-large");
                }else{
                    slot.setAttribute("class","slot");
                }

                var prep = document.createElement("div");
                if(machine.emplacement_max > 4){
                    prep.setAttribute("class","slot machine-large");
                }else{
                    prep.setAttribute("class","slot");
                }


                col_names.appendChild(nameCell);
                col_slots.appendChild(slot);
                col_prep.appendChild(prep);
            }
        }

        var container = document.getElementById("machines");
        container.appendChild(col_names);
        container.appendChild(col_slots);
        container.appendChild(col_prep);
    });
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
loadData();