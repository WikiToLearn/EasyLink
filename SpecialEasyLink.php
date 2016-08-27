<?php
class SpecialEasyLink extends SpecialPage {
  public function __construct( $name = 'EasyLink' ) {
    parent::__construct( $name );
  }

  public function execute() {
      $this->renderCreditsAndStats();
  }

  public static function analyze($wikitext, $scoredCandidates, $threshold, $babelDomain, $language){
    $params = [
      'wikitext' => $wikitext,
      'scoredCandidates' => $scoredCandidates,
      'threshold' => $threshold,
      'babelDomain' => $babelDomain,
      'language' => $language
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
    ));
    // Send the request & save response to $response
    $response = curl_exec($curl);
    // Close request to clear up some resources
    curl_close($curl);
    return $response;
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

  public static function storeAnnotation($annotation, $pageName, $username){
    $params = [
      'annotation' => $annotation,
      'username' => $username,
      'pageName' => $pagename
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
    return $response;
  }

  public static function pollingAPI($requestId){
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
    return $response;
  }

  public static function deleteRequest($requestId){
    // Get cURL resource
    $curl = curl_init();
    // Set some options - we are passing in a userAgent too here
    curl_setopt_array($curl, array(
      CURLOPT_RETURNTRANSFER => 1,
      CURLOPT_CUSTOMREQUEST => 'DELETE',
      CURLOPT_URL => 'http://easylink:8080/EasyLinkAPI/webapi/status/' . $requestId
    ));
    // Send the request & save response to $response
    $response = curl_exec($curl);
    // Close request to clear up some resources
    curl_close($curl);
    return $response;
  }

  public static function getMoreGlosses($babelnetId){
    // Get cURL resource
    $curl = curl_init();
    // Set some options - we are passing in a userAgent too here
    curl_setopt_array($curl, array(
      CURLOPT_RETURNTRANSFER => 1,
      CURLOPT_URL => 'http://easylink:8080/EasyLinkAPI/webapi/annotation/' . $babelnetId
    ));
    // Send the request & save response to $response
    $response = curl_exec($curl);
    // Close request to clear up some resources
    curl_close($curl);
    return $response;
  }

  private function renderCreditsAndStats(){
    $out = $this->getOutput();
    $out->addWikiMsg('easylink-credits-and-stats');
  }
}
