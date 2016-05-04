<?php
class SpecialEasyLink extends SpecialPage {
    public function __construct( $name = 'EasyLink' ) {
        parent::__construct( $name );
    }

    public function execute() {
        $request = $this->getRequest();
        $wikitext = $request->getVal( 'wikitext' );
        $this->forward($wikitext);
    }

    public function forward($wikitext){
        $params = ['wikitext' => $wikitext];
        // Get cURL resource
        $curl = curl_init();
        // Set some options - we are passing in a useragent too here
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => 'http://easylink:8080/EasyLink/webapi/analyze',
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => http_build_query($params),
            CURLOPT_TIMEOUT => 60
        ));
        // Send the request & save response to $resp
        $response = curl_exec($curl);
        // Close request to clear up some resources
        curl_close($curl);
        echo $response;
        die();
    }
}
