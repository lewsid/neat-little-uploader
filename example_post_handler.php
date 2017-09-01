<?php

/*
	This will almost always throw this notice: 
	`PHP Deprecated:  Automatically populating $HTTP_RAW_POST_DATA is deprecated and will be removed in a future version. To avoid this warning set 'always_populate_raw_post_data' to '-1' in php.ini and use the php://input stream instead. in Unknown on line 0`

	...but worry not. It's a well documented issue in PHP and nothing to worry about (https://stackoverflow.com/questions/26679157/why-is-http-raw-post-data-being-called)
*/

$filename = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);
$ext = pathinfo($filename, PATHINFO_EXTENSION);
$file = file_get_contents('php://input');

$new_filename = uniqid() . '.' . $ext;

if(file_put_contents(__DIR__ . '/uploads/' . $new_filename, $file))
{
	echo json_encode(array('success' => 1, 'error' => 0, 'original_filename' => $filename, 'new_filename' => $new_filename));
}
else
{
	echo json_encode(array('success' => 0, 'error' => 'error writing file'));
	return false;
}