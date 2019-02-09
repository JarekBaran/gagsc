<?php

$db = array();
$counter = 0;

foreach(glob('./data/ga/*.txt', GLOB_BRACE) as $gaFile){
  $gaAccount = basename($gaFile, ".txt");
  preg_match_all('/(.+)\(UA-[0-9]+-[0-9]+\)/i', file_get_contents($gaFile), $data[$gaAccount]);
  foreach($data[$gaAccount][0] as $gaDomain){
    $domain = explode('(', $gaDomain);
    @$db[$counter]->domain = $domain[0];
    @$db[$counter]->ua = str_replace(')', '', $domain[1]);
    @$db[$counter]->account = $gaAccount;
    $counter++;
  }
}

foreach(glob('./data/gsc/*.txt', GLOB_BRACE) as $gscFile){
  $gscAccount = basename($gscFile, ".txt");
  preg_match_all('/https?:\/\/([^\/]+)\//i', file_get_contents($gscFile), $data[$gscAccount]);
  foreach($data[$gscAccount][0] as $gscDomain){
    @$db[$counter]->domain = $gscDomain;
    @$db[$counter]->account = $gscAccount;
    $counter++;
  }
}

$json = json_encode($db);

$file = fopen('./data/data.json','w+');
fwrite($file, $json);
fclose($file);

$status = 'The database has been updated - '.date("Y-m-d").' / '.$counter.' items';
echo '<h1>'.$status.'</h1>'; echo '<pre>'; echo print_r($db); echo '</pre>';

$log = fopen('./data/log.txt','w+');
$logMsg = "const logMsg = \"".$status."\";";
fwrite($log, $logMsg);
fclose($log);

$csv = fopen('./data/gagsc.csv','w+');
$array = json_decode($json, true);

foreach ($array as $item) {
    fputcsv($csv, $item);
}

fclose($csv);

?>
