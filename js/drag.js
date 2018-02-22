window.addEventListener("load", function (e) {
    Test();
});

function Test() {
    $(function () {
        $('.slots_prepa>.slot').droppable({
            accept: ".phase, .OF",
            drop: function (event, ui) {
                if ($(ui.draggable).parent() !== $(this)) {
                    var clone = $(ui.draggable).clone();
                    clone.appendTo($(this));

                    var machineID = $(this).parent().attr('id');
                    machineID.replace("_prep", "");
                    console.log(machineID);
                    $(ui.draggable).attr('prep-machine', machineID);
                    $(ui.draggable).addClass("inPrep");
                    $(ui.draggable).removeClass("draggable");
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
        $('.OF').draggable({
            snap: '.slots_prepa .slot',
            revert: 'invalid',
            //snapMode: 'inner',
            opacity: 0.7,
            helper: "clone",
            stack: ".OF",
            drag: function () {
                $("#SH50_prep").addClass("prochaine");
                $("#SH500A_prep").addClass("prochaine");
                $("#SH500C_prep").addClass("prochaine");
                $("#HM800_prep").addClass("prochaine");


                $("#NH5000A_prep").addClass("prochaineRouge");

                $("#NH5000B_prep").addClass("prochaineRouge");

                $("#SH503_prep").addClass("prochaineRouge");


                $("#Clock1_prep").addClass("prochaineRouge");

                $("#Clock2_prep").addClass("prochaineRouge");


            },

            stop: function () {
                $("#SH50_prep").removeClass("prochaine");
                $("#SH500A_prep").removeClass("prochaine");
                $("#SH500C_prep").removeClass("prochaine");
                $("#HM800_prep").removeClass("prochaine");


                $("#NH5000A_prep").removeClass("prochaineRouge");

                $("#NH5000B_prep").removeClass("prochaineRouge");

                $("#SH503_prep").removeClass("prochaineRouge");


                $("#Clock1_prep").removeClass("prochaineRouge");

                $("#Clock2_prep").removeClass("prochaineRouge");


            }

        });


    });
}