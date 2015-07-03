<?php
// File: index.php
// Main program.
require_once "config.php";
$name = $_GET("name");
echo printf($text, $name);
