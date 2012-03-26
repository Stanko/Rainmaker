<?php
header('Content-Type: text/xml; charset=utf-8');
$weather = urlencode($_GET['weather']);
$hl = urlencode($_GET['hl']);
$xmlData = file_get_contents("http://www.google.com/ig/api?weather=$weather&hl=$hl");
//echo $xmlData;
echo mb_convert_encoding($xmlData, 'UTF-8');

?>
