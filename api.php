<?php
require_once 'Client.php';

class API {
    private static $url = 'https://redmine.rebelmouse.com';

    private static function getAuth() {
        $path = $_SERVER['PATH_INFO'];
        $re = "/\\/(?P<user>[\\w]+)[:]*(?P<password>.*)[:](?P<key>[\\w\\n]+)\\/(?P<path>.*)/";
        $matches = array();
 
        preg_match($re, $path, $matches);

        return $matches;
    }

    public static function cors() {

        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }

        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

            exit(0);
        }
    }

    public static function run () {
        API::cors();
        $authInfo = API::getAuth();
        $authUser = $authInfo['user'];
        $authPass = $authInfo['password'];
        $key = $authInfo['key'];
        $pathUri = join('?', array('/' . $authInfo['path'], $_SERVER['QUERY_STRING']));

        $method = strtolower($_SERVER['REQUEST_METHOD']);
        $client = new Redmine_Client(API::$url, $authUser, $authPass, $key);
        switch ($method) {
            case 'post':
            break;
            case 'put':
            break;
            case 'delete':
            break;
            default:
                echo $client->get($pathUri, false);
            break;
        }
    }

}

API::run();
