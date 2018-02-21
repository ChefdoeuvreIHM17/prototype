window.addEventListener("load", function (e) {
    Test();
});

function Test() {
    $(function () {
        $('.slots_prepa>.slot').droppable({
            accept: ".phase, .OF",
            drop: function (event, ui) {
                if ($(ui.draggable).parent() !== $(this)) {
                    $(ui.draggable).appendTo($(this));
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
                $("#SH50_prep_0").addClass("prochaine");
                $("#SH50_prep_1").addClass("prochaine");
                $("#SH500A_prep_0").addClass("prochaine");
                $("#SH500A_prep_1").addClass("prochaine");
                $("#SH500C_prep_0").addClass("prochaine");
                $("#SH500C_prep_1").addClass("prochaine");
                $("#HM800_prep_0").addClass("prochaine");
                $("#HM800_prep_1").addClass("prochaine");


                $("#NH5000A_prep_0").addClass("prochaineRouge");
                $("#NH5000A_prep_1").addClass("prochaineRouge");

                $("#NH5000B_prep_0").addClass("prochaineRouge");
                $("#NH5000B_prep_1").addClass("prochaineRouge");

                $("#SH503_prep_0").addClass("prochaineRouge");
                $("#SH503_prep_1").addClass("prochaineRouge");


                $("#Clock1_prep_0").addClass("prochaineRouge");
                $("#Clock1_prep_1").addClass("prochaineRouge");

                $("#Clock2_prep_0").addClass("prochaineRouge");
                $("#Clock2_prep_1").addClass("prochaineRouge");


            },

            stop: function () {
                $("#SH50_prep_0").removeClass("prochaine");
                $("#SH50_prep_1").removeClass("prochaine");
                $("#SH500A_prep_0").removeClass("prochaine");
                $("#SH500A_prep_1").removeClass("prochaine");
                $("#SH500C_prep_0").removeClass("prochaine");
                $("#SH500C_prep_1").removeClass("prochaine");
                $("#HM800_prep_0").removeClass("prochaine");
                $("#HM800_prep_1").removeClass("prochaine");


                $("#NH5000A_prep_0").removeClass("prochaineRouge");
                $("#NH5000A_prep_1").removeClass("prochaineRouge");

                $("#NH5000B_prep_0").removeClass("prochaineRouge");
                $("#NH5000B_prep_1").removeClass("prochaineRouge");

                $("#SH503_prep_0").removeClass("prochaineRouge");
                $("#SH503_prep_1").removeClass("prochaineRouge");


                $("#Clock1_prep_0").removeClass("prochaineRouge");
                $("#Clock1_prep_1").removeClass("prochaineRouge");

                $("#Clock2_prep_0").removeClass("prochaineRouge");
                $("#Clock2_prep_1").removeClass("prochaineRouge");


            }

        });


    });
}