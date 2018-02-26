window.addEventListener("load", function (e) {
    refreshDraggable();
});

function showProchaine() {
    $("#SH50_prep").addClass("prochaine");
    $("#SH500A_prep").addClass("prochaine");
    $("#SH500C_prep").addClass("prochaine");
    $("#HM800_prep").addClass("prochaine");
    $("#HM8000_prep").removeClass("prochaine");
    $("#NH5000A_prep").addClass("prochaineRouge");
    $("#NH5000B_prep").addClass("prochaineRouge");
    $("#SH503_prep").addClass("prochaineRouge");
    $("#CLOCK900_prep").addClass("prochaineRouge");
    $("#CLOCK902_prep").addClass("prochaineRouge");
}

function hideProchaine() {
    $("#SH50_prep").removeClass("prochaine");
    $("#SH500A_prep").removeClass("prochaine");
    $("#SH500C_prep").removeClass("prochaine");
    $("#HM800_prep").removeClass("prochaine");
    $("#HM8000_prep").removeClass("prochaine");
    $("#NH5000A_prep").removeClass("prochaineRouge");
    $("#NH5000B_prep").removeClass("prochaineRouge");
    $("#SH503_prep").removeClass("prochaineRouge");
    $("#CLOCK900_prep").removeClass("prochaineRouge");
    $("#CLOCK902_prep").removeClass("prochaineRouge");
}

$('#machines').find('.slot').onmouseenter(function (event) {
    hideProchaine()
}).onmouseleave(function (event) {
    showProchaine()
});

function refreshDraggable() {
    $(function () {
        $('.slots_prepa>.slot').droppable({
            accept: ".phase, .OF",
            drop: function (event, ui) {
                var clone, machineID;
                if ($(ui.draggable).parent() !== $(this)) {
                    console.log($(ui.draggable).parent().parent().parent().attr('id'));
                    if ($(ui.draggable).hasClass("inPrep")) {
                        $(ui.draggable).appendTo($(this));
                        var drop_p = $(this).offset();
                        var drag_p = ui.draggable.offset();
                        var left_end = drop_p.left - drag_p.left + 1;
                        var top_end = drop_p.top - drag_p.top + 1;
                        ui.draggable.css({
                            top: '+=' + top_end,
                            left: '+=' + left_end
                        });
                    } else {
                        clone = $(ui.draggable).clone();
                        clone.appendTo($(this));
                        clone.addClass("inPrep");
                        machineID = $(this).parent().attr('id');
                        machineID.replace("_prep", "");
                        $(ui.draggable).attr('prep-machine', machineID);
                        $(ui.draggable).addClass("alreadyInPrep");
                        $(ui.draggable).removeClass("ui-draggable");
                        $(ui.draggable).removeClass("ui-draggable-handle");
                        $(ui.draggable).draggable("disable");
                    }
                    refreshDraggable();
                }
                /*var drop_p = $(this).offset();
                 var drag_p = ui.draggable.offset();
                 var left_end = drop_p.left - drag_p.left + 1;
                 var top_end = drop_p.top - drag_p.top + 1;
                 ui.draggable.animate({
                 top: '+=' + top_end,
                 left: '+=' + left_end
                 });*/
            }
        });
        $('#reserve .OF:not(.alreadyInPrep)').draggable({
            snap: '.slots_prepa .slot',
            revert: 'invalid',
            //snapMode: 'inner',
            opacity: 0.7,
            helper: "clone",
            stack: ".OF",
            drag: function (event) {
                showProchaine()
            },
            stop: function (event) {
                hideProchaine()
            }
        });
        $('.OF.inPrep').draggable({
            snap: '.slots_prepa .slot',
            revert: 'invalid',
            snapMode: 'inner',
            opacity: 0.7,
            stack: ".inPrep",
            drag: function (event) {
                showProchaine()
            },
            stop: function (event) {
                hideProchaine()
            }
        });
    });
}