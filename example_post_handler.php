<?php

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