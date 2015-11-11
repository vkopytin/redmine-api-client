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

    public static function run () {
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
