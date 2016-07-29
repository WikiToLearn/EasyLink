<?php
class SpecialEasyLink extends IncludableSpecialPage {
  public function __construct( $name = 'EasyLink' ) {
    parent::__construct( $name );
  }

  public function execute() {
    $method = $_SERVER['REQUEST_METHOD'];
    $request = $this->getRequest();
    if($method == 'POST' && $request->getVal( 'wikitext' ) != null){
      $wikitext = $request->getVal( 'wikitext' );
      $scoredCandidates = $request->getVal('scoredCandidates');
      $threshold = $request->getVal('threshold');
      $babelDomain = $request->getVal('babelDomain');
      $this->forwardPost($wikitext, $scoredCandidates, $threshold, $babelDomain);
    }elseif($method == 'POST' &&  $request->getVal( 'annotation' ) != null){
      $annotation = $request->getVal( 'annotation' );
      $username = $request->getVal('username');
      $pageName = $request->getVal('pageName');
      $this->storeAnnotation($annotation, $username, $pageName);
    }else if($method == 'GET' &&  $request->getVal( 'id' ) != null){
      $requestId = $request->getVal( 'id' );
      $this->pollingAPI($requestId);
    }else if($method == 'DELETE') {
      $requestId = $request->getVal('id');
      $this->forwardDelete($requestId);
    }
  }

  public static function forwardPost($wikitext, $scoredCandidates, $threshold, $babelDomain){
    $params = ['wikitext' => $wikitext, 'scoredCandidates' => $scoredCandidates, 'threshold' => $threshold, 'babelDomain' => $babelDomain];

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

  public static function forwardGetAnnotation($babelnetId, $glossSource){
    // Get cURL resource
    $curl = curl_init();
    $url = 'http://easylink:8080/EasyLinkAPI/webapi/annotation/' . $babelnetId . '/' . str_replace(' ', '%20', $glossSource);
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

  public function storeAnnotation($annotation, $username, $pageName){
    /*$result = json_decode($annotation);
    $params = [
      'babelnetId' => $result->babelnetId
      'title' => $result->title,
      'gloss' => $result->gloss,
      'glossSource' => $result->glossSource,
      'wikiLink' => $result->wikiLink,
      'babelLink' => $result->babelLink
    ];*/
    $params = [
      'annotation' => $annotation,
      'username' => $username,
      'pageName' => $pageName
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
    //return $response;
    echo $response;
    die();
  }

  public function forwardDelete($requestId){
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


}
