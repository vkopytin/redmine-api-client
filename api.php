<?php
require_once 'Client.php';

class API {
    private static $url = 'https://redmine.rebelmouse.com';

    public static function run1 () {
        $httpHeader = array();
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_VERBOSE, 0);
        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_USERNAME, 'che');
        curl_setopt($curl, CURLOPT_PASSWORD, 'guevara2012!');
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_URL, API::$url . '/issues.json');
        curl_setopt($curl, CURLOPT_PORT, 443);
        $httpHeader[] = 'X-Redmine-API-Key: '.API::$key;
        $httpHeader[] = 'Expect: ';
        $httpHeader[] = 'Content-Type: application/json';
        curl_setopt($curl, CURLOPT_HTTPHEADER, $httpHeader);
        $response = trim(curl_exec($curl));
        echo curl_error($curl);
        curl_close($curl);
        echo $response;
    }

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
