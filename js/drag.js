

function showProchaine(cdc) {
    $('#col_prep > div').each(function () {
        var cdcID, realCDC, machineID, machine;
        $(this).addClass("prochaine");
        for (cdcID in planning.CDCs) {
            if (planning.CDCs.hasOwnProperty(cdcID)) {
                realCDC = planning.CDCs[cdcID];
                machineID = $(this).attr('id').replace("_prep", "");
                if (realCDC.hasOwnProperty(machineID)) {
                    machine = realCDC[machineID];
                    if (cdcID.replace(" TM", "") !== cdc.replace(" TM", "")) {
                        $(this).attr('data-preferable', 'false');
                    } else {
                        console.log(machineID, machine['reste a servir']);
                        if (machine['en-cours'] < machine['jetons']) {
                            $(this).attr('data-preferable', 'true');
                        }
                    }
                }
            }
        }
        console.log("===============================")
    });
}

function hideProchaine() {
    $('#col_prep > div').each(function () {
        $(this).removeClass("prochaine");
        $(this).attr('data-preferable', 'dunno');
    });
}

$('#machines').find('.slot').hover(
    function (event) {
        showProchaine();
    },
    function (event) {
        hideProchaine($(this).attr('data-cdc'));
});

function refreshDraggable() {
    console.log('drag');
    $('.slots_prepa>.slot').droppable({
        accept: ".phase, .OF",
        drop: function (event, ui) {
            var clone, machineID;
            if ($(ui.draggable).parent() !== $(this)) {
                ui.helper.data('dropped', true);

                if ($(ui.draggable).hasClass("inPrep")) { //si l'on bouge un of qui est en prépa
                    $(ui.draggable).appendTo($(this));
                    var drop_p = $(this).offset();
                    var drag_p = ui.draggable.offset();
                    var left_end = drop_p.left - drag_p.left + 1;
                    var top_end = drop_p.top - drag_p.top + 1;
                    ui.draggable.css({
                        top: '+=' + top_end,
                        left: '+=' + left_end
                    });
                } else { //si l'on bouge un of qui est en attente
                    clone = $(ui.draggable).clone();
                    clone.appendTo($(this));
                    clone.addClass("inPrep");
                    machineID = $(this).parent().attr('id');
                    machineID.replace("_prep", "");
                    $(ui.draggable).attr('prep-machine', machineID);
                    $(ui.draggable).addClass("alreadyInPrep");
                    $(ui.draggable).draggable("disable");
                }
                refreshDraggable();
            }
        }
    });
    $('#reserve').find('.OF:not(.alreadyInPrep)').draggable({
        snap: '.slots_prepa .slot',
        revert: 'invalid',
        //snapMode: 'inner',
        opacity: 0.7,
        helper: "clone",
        stack: ".OF",
        drag: function (event, ui) {
            showProchaine($(this).attr('data-cdc'))
        },
        start: function (event, ui) {
            ui.helper.data('dropped', false);
        },
        stop: function (event, ui) {
            hideProchaine();
        }
    });
    $('.OF.inPrep').draggable({
        snap: '.slots_prepa .slot',
        //revert: 'invalid',
        snapMode: 'inner',
        opacity: 0.7,
        stack: ".OF",
        drag: function (event, ui) {
            showProchaine($(this).attr('data-cdc'));
        },
        start: function (event, ui) {
            ui.helper.data('dropped', false);
        },
        stop: function (event, ui) {
            if (ui.helper.data('dropped') !== true) { //cancel mecanism
                realOF = $('.OF[data-ofid=\"' + $(this).attr('data-ofid') + '\"]:not(.inPrep)');
                realOF.attr('prep-machine', 'dunno');
                realOF.removeClass("alreadyInPrep");
                realOF.draggable("enable");
                $(this).remove();
                refreshDraggable();
            }
            hideProchaine();
        }
    });
}