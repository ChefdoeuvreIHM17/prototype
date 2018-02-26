<?php
try {
    $conn = new PDO("odbc:HELIOSII O10","ETAT","ETAT");
    $sth = $conn->prepare("SELECT OFS.ID_OFS, ARTICLE.ID_ARTICLE, OFS_PHASE.ID_PHASE, MAX(HEURE.DATE_POINT), MIN(HEURE_1.DATE_POINT), OUTILLAGE.REF_OUTILLAGE, PO_POINT.LIBELLE, OFS_CDC.LIBELLE, OFS_PHASE.TPS_USI, OFS_PHASE.LOT_TRAIT, OFS_PHASE.TU_FAIT, OFS.QTE_LANCEE
 FROM   ((((((HELIOS.HEURE HEURE INNER JOIN HELIOS.OFS_PHASE OFS_PHASE ON (((HEURE.CD_OFS=OFS_PHASE.CD_OFS) AND (HEURE.CD_GAMME=OFS_PHASE.CD_GAMME)) AND (HEURE.N_LIEN=OFS_PHASE.N_LIEN)) AND (HEURE.CD_PHASE=OFS_PHASE.CD_PHASE)) INNER JOIN HELIOS.PO_POINT PO_POINT ON HEURE.CD_PO_POINT=PO_POINT.CD_PO_POINT) INNER JOIN ((HELIOS.OFS OFS INNER JOIN HELIOS.OFS_GAMME OFS_GAMME ON ((OFS.CD_OFS=OFS_GAMME.CD_OFS) AND (OFS.CD_GAMME=OFS_GAMME.CD_GAMME)) AND (OFS.N_LIEN=OFS_GAMME.N_LIEN)) INNER JOIN HELIOS.ARTICLE ARTICLE ON OFS.CD_ARTICLE=ARTICLE.CD_ARTICLE) ON ((OFS_PHASE.CD_OFS=OFS_GAMME.CD_OFS) AND (OFS_PHASE.CD_GAMME=OFS_GAMME.CD_GAMME)) AND (OFS_PHASE.N_LIEN=OFS_GAMME.N_LIEN)) INNER JOIN HELIOS.HEURE HEURE_1 ON (((OFS_PHASE.CD_OFS=HEURE_1.CD_OFS) AND (OFS_PHASE.CD_GAMME=HEURE_1.CD_GAMME)) AND (OFS_PHASE.N_LIEN=HEURE_1.N_LIEN)) AND (OFS_PHASE.CD_PHASE=HEURE_1.CD_PHASE)) INNER JOIN HELIOS.OFS_CDC OFS_CDC ON (OFS_PHASE.CD_OFS=OFS_CDC.CD_OFS) AND (OFS_PHASE.CD_CDC=OFS_CDC.CD_OFS_CDC)) LEFT OUTER JOIN HELIOS.PH_OUTILLAGE PH_OUTILLAGE ON ((OFS_PHASE.CD_GAMME=PH_OUTILLAGE.CD_GAMME) AND (OFS_PHASE.CD_PHASE=PH_OUTILLAGE.CD_PHASE)) AND (OFS_PHASE.N_LIEN=PH_OUTILLAGE.N_LIEN)) LEFT OUTER JOIN HELIOS.OUTILLAGE OUTILLAGE ON PH_OUTILLAGE.CD_OUTILLAGE=OUTILLAGE.CD_OUTILLAGE
 WHERE  OFS_PHASE.STATUT='EC'
 AND (OFS.ETAT_OF='EC' OR OFS.ETAT_OF='T')  
 AND (OUTILLAGE.REF_OUTILLAGE IS  NULL OR OUTILLAGE.REF_OUTILLAGE LIKE 'STD%' OR OUTILLAGE.REF_OUTILLAGE LIKE '%')
 group by OFS_PHASE.STATUT, ARTICLE.ID_ARTICLE, OFS.ID_OFS, OFS_PHASE.ID_PHASE, OFS.ETAT_OF, OUTILLAGE.REF_OUTILLAGE,PO_POINT.LIBELLE, OFS_CDC.LIBELLE, OFS_PHASE.TPS_USI, OFS_PHASE.LOT_TRAIT, OFS_PHASE.TU_FAIT, OFS.QTE_LANCEE
 ORDER BY PO_POINT.LIBELLE, MIN(HEURE_1.DATE_POINT)");
    $sth->execute();

    $result = $sth->fetchAll(PDO::FETCH_ASSOC);

    array_walk_recursive($result,function (&$value){
        $value = htmlspecialchars(html_entity_decode($value,ENT_QUOTES,'UTF-8'),ENT_QUOTES, 'UTF-8');
    });
    echo json_encode($result);
}catch(PDOException $ex){
    die(json_encode(array('outcome'=>false, 'message'=>'Unable to connect')));
}

?>