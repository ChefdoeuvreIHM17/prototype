window.onload = function (e) {
    Test();
};

function Test() {
    $(function () {
        $(".OF").draggable({
            revert: 'invalid',
            snap: true
        });
        $('.slot').droppable({

            accept: ".phase, .OF",
            /*drop : function(){
             alert('Action terminée !');
             }*/
        });
        $('.OF').draggable({
            revert: 'invalid',
            snap: true,
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