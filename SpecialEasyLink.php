<?php
class SpecialEasyLink extends SpecialPage {
    public function __construct( $name = 'EasyLink' ) {
        parent::__construct( $name );
    }

    public function execute() {
        $method = $_SERVER['REQUEST_METHOD'];
        $request = $this->getRequest();
        if($method == 'POST'){
            $wikitext = $request->getVal( 'wikitext' );
            $this->forwardPost($wikitext);
        }else if($method == 'GET'){
            $requestId = $request->getVal( 'id' );
            $this->forwardGet($requestId);
        }   
    }

    public function forwardPost($wikitext){
        $params = ['wikitext' => $wikitext];
        // Get cURL resource
        $curl = curl_init();
        // Set some options - we are passing in a userAgent too here
        curl_setopt_array($curl, array(
            CURLOPT_FRESH_CONNECT => 1, 
            CURLOPT_RETURNTRANSFER => 1, 
            CURLOPT_FORBID_REUSE => 1, 
            CURLOPT_URL => 'http://easylink:8080/EasyLinkAPI/webapi/analyze',
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => http_build_query($params),
            //CURLOPT_TIMEOUT => 60
        ));
        // Send the request & save response to $response
        $response = curl_exec($curl);
        // Close request to clear up some resources
        curl_close($curl);
        echo $response;
        die();
    }

    public function forwardGet($requestId){
        // Get cURL resource
        $curl = curl_init();
        // Set some options - we are passing in a userAgent too here
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => 'http://easylink:8080/EasyLinkAPI/webapi/status/' . $requestId
        ));
        // Send the request & save response to $response
        $response = curl_exec($curl);
        // Close request to clear up some resources
        curl_close($curl);
        echo $response;
        die();
    }
}
