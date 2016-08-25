<?php
header('Content-type: text/json');

function get_title($url){
  $str = file_get_contents($url);
  if(strlen($str)>0){
    $str = trim(preg_replace('/\s+/', ' ', $str)); // supports line breaks inside <title>
    preg_match("/\<title\>(.*)\<\/title\>/i",$str,$title); // ignore case
    return $title[1];
  }
}
if (!isset($_GET['url'])) {
	die('HTTP 400 - Bad Request');
}

$url = $_GET['url'];
$title = get_title($url);
$thumb_name = md5($url).'.png';
$thumb_uri = "/var/www/winter_camp/bookmark/thumbs/";
$result = shell_exec("xvfb-run python /home/kostrian/thumb/thumb.py ".$url." ".$thumb_uri.$thumb_name);
if ($result == null) {
	die('HTTP 500 - Internal Server Error');
}

$thumb_path = "thumbs/".$thumb_name;
$json = array(
	'title' => $title,
	'thumb_path' => $thumb_path
	);

print json_encode($json);
?>