<?php
try {
    $conn = new PDO("odbc:HELIOSII O10","ETAT","ETAT");
    $sth = $conn->prepare("REQUETE");
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