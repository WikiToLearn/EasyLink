<?php
class SpecialEasyLink extends IncludableSpecialPage {
  public function __construct( $name = 'EasyLink' ) {
    parent::__construct( $name );
  }

  public function execute() {
    $request = $this->getRequest();
    switch($request->getVal('command')){
      case 'analyze':
      $this->analyze($request);
      break;
      case 'polling':
      $this->pollingAPI($request);
      break;
      case 'delete':
      $this->deleteRequest($request);
      break;
      case 'storeAnnotation':
      $this->storeAnnotation($request);
      break;
      default:
      $this->renderCreditsAndStats();
      break;
    }
  }

  private function analyze($request){
    $params = [
      'wikitext' => $request->getVal('wikitext'),
      'scoredCandidates' => $request->getVal('scoredCandidates'),
      'threshold' => $request->getVal('threshold'),
      'babelDomain' => $request->getVal('babelDomain')
    ];
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

  public static function getAnnotation($babelnetId, $glossSource){
    // Get cURL resource
    $curl = curl_init();
    $url = 'http://easylink:8080/EasyLinkAPI/webapi/annotation/'
    . $babelnetId . '/' . str_replace(' ', '%20', $glossSource);
    // Set some options - we are passing in a userAgent too here
    curl_setopt_array($curl, array(
      CURLOPT_RETURNTRANSFER => 1,
      CURLOPT_URL => $url
    ));
    // Send the request & save response to $response
    $response = curl_exec($curl);
    // Close request to clear up some resources
    curl_close($curl);
    return $response;
  }

  private function storeAnnotation($request){
    $params = [
      'annotation' => $request->getVal('annotation'),
      'username' => $request->getVal('username'),
      'pageName' => $request->getVal('pageName')
    ];
    // Get cURL resource
    $curl = curl_init();
    // Set some options - we are passing in a userAgent too here
    curl_setopt_array($curl, array(
      CURLOPT_FRESH_CONNECT => 1,
      CURLOPT_RETURNTRANSFER => 1,
      CURLOPT_FORBID_REUSE => 1,
      CURLOPT_URL => 'http://easylink:8080/EasyLinkAPI/webapi/annotation',
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

  private function pollingAPI($request){
    $requestId = $request->getVal('requestId');
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
    //return $response;
    echo $response;
    die();
  }

  private function deleteRequest($request){
    $requestId = $request->getVal('requestId');
    // Get cURL resource
    $curl = curl_init();
    // Set some options - we are passing in a userAgent too here
    curl_setopt_array($curl, array(
      CURLOPT_RETURNTRANSFER => 1,
      CURLOPT_CUSTOMREQUEST => "DELETE",
      CURLOPT_URL => 'http://easylink:8080/EasyLinkAPI/webapi/status/' . $requestId
    ));
    // Send the request & save response to $response
    $response = curl_exec($curl);
    // Close request to clear up some resources
    curl_close($curl);
    echo $response;
    die();
  }

  private function renderCreditsAndStats(){
    $out = $this->getOutput();
    $out->addWikiMsg('easylink-credits-and-stats');
  }
}
