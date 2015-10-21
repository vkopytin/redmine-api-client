<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

class ProxyHandler
{
    private $url;
    private $proxy_url;
    private $proxy_host;
    private $proxy_proto;
    private $translated_url;
    private $curl_handler;
    private $cache_control=false;
    private $pragma=false;
    private $client_headers=array();

    function __construct($url, $proxy_url) {
        // Strip the trailing '/' from the URLs so they are the same.
        $this->url = rtrim($url,'/');
        $this->proxy_url =  rtrim($proxy_url,'/');

        // Parse all the parameters for the URL
        if (isset($_SERVER['PATH_INFO'])) {
            $proxy_url .= $_SERVER['PATH_INFO'];
        }
        else {
            // Add the '/' at the end
            $proxy_url .= '/';
        }

        if ($_SERVER['QUERY_STRING'] !== '') {
            $proxy_url .= "?{$_SERVER['QUERY_STRING']}";
        }

        $this->translated_url = $proxy_url;

        $this->curl_handler = curl_init($this->translated_url);

        // Set various options
        $this->setCurlOption(CURLOPT_RETURNTRANSFER, true);
        $this->setCurlOption(CURLOPT_BINARYTRANSFER, true); // For images, etc.
        $this->setCurlOption(CURLOPT_USERAGENT,$_SERVER['HTTP_USER_AGENT']);
        $this->setCurlOption(CURLOPT_WRITEFUNCTION, array($this,'readResponse'));
        $this->setCurlOption(CURLOPT_HEADERFUNCTION, array($this,'readHeaders'));

        // Process post data.
        if (count($_POST)) {
            // Empty the post data
            $post=array();

            // Set the post data
            $this->setCurlOption(CURLOPT_POST, true);

            // Encode and form the post data
            foreach($_POST as $key=>$value) {
                $post[] = urlencode($key)."=".urlencode($value);
            }

            $this->setCurlOption(CURLOPT_POSTFIELDS, implode('&',$post));

            unset($post);
        }
        elseif ($_SERVER['REQUEST_METHOD'] !== 'GET') { // Default request method is 'get'
            // Set the request method
            $this->setCurlOption(CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
        }

        // Handle the client headers.
        $this->handleClientHeaders();

    }

    public function setClientHeader($header) {
        $this->client_headers[] = $header;
    }

    // Executes the proxy.
    public function execute() {
        $this->setCurlOption(CURLOPT_HTTPHEADER, $this->client_headers);
        curl_exec($this->curl_handler);
    }

    // Get the information about the request.
    // Should not be called before exec.
    public function getCurlInfo() {
        return curl_getinfo($this->curl_handler);
    }

    // Sets a curl option.
    public function setCurlOption($option, $value) {
        curl_setopt($this->curl_handler, $option, $value);
    }

    protected function readHeaders(&$cu, $string) {
        $length = strlen($string);
        if (preg_match(',^Location:,', $string)) {
            $string = str_replace($this->proxy_url, $this->url, $string);
        }
        elseif(preg_match(',^Cache-Control:,', $string)) {
            $this->cache_control = true;
        }
        elseif(preg_match(',^Pragma:,', $string)) {
            $this->pragma = true;
        }
        if ($string !== "\r\n") {
            header(rtrim($string));

        }
        return $length;
    }
    
    protected function handleClientHeaders() {
        $headers = apache_request_headers();

        foreach ($headers as $header => $value) {
            switch($header) {
                case 'Host':
                    break;
                default:
                    $this->setClientHeader(sprintf('%s: %s', $header, $value));
                    break;
            }
        } 
    }

    protected function readResponse(&$cu, $string) {
        static $headersParsed = false;

        // Clear the Cache-Control and Pragma headers
        // if they aren't passed from the proxy application.
        if ($headersParsed === false) {
            if (!$this->cache_control) {
                header('Cache-Control: ');
            }
            if (!$this->pragma) {
                header('Pragma: ');
            }
            $headersParsed = true;
        }
        $length = strlen($string);
        echo $string;
        return $length;
    }
}

$proxy = new ProxyHandler('http://crym.uphero.com','https://che:guevara2012!@redmine.rebelmouse.com');
$proxy->execute();
?>
