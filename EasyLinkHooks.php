<?php
if ( !defined( 'MEDIAWIKI' ) ){
  die( );
}

class EasyLinkHooks{

  function onParserFirstCallSetup( Parser $parser ) {
    $parser->setHook( 'easylink', 'EasyLinkHooks::easyLinkRender' );
    return true;
  }

  /**
   * @param Title $title Title being used for request
   * @param Article|null $article
   * @param OutputPage $output
   * @param User $user
   * @param WebRequest $request
   * @param MediaWiki $mediaWiki
   * @return bool Always true
  */
  /*
  public static function onBeforeInitialize(
  Title $title, $article, OutputPage $output,
  User $user, WebRequest $request, MediaWiki $mediaWiki
  ) {
    print $user;
    return true;
  }*/

  /**
   * @param OutputPage $out
   * @param Skin $skin
   * @return bool Always true
  */
  public static function onBeforePageDisplay(OutputPage $out, Skin $skin){
    $out->addModules(['ext.easyLink']);
    return true;

  }

  static function easyLinkRender( $input, array $args, Parser $parser, PPFrame $frame ) {
    $parser->disableCache();
    $parser->enableOOUI(true);

    $babelnetId = $args['data-babelnet-id'];
    $glossSource = $args['data-gloss-source'];

    $resultJSON = SpecialEasyLink::forwardGetAnnotation($babelnetId, $glossSource);
    $result = json_decode($resultJSON);

    /*$title = $args['data-title'];
    $gloss = $args['data-gloss'];
    $glossSource = $args['data-gloss-source'];
    if($args['data-wiki-link'] != 'undefined'){
    $wikiLink =  '<a target="_blank" href="' . $args['data-wiki-link'] . '"><img src="http://image005.flaticon.com/28/png/16/33/33949.png"></a>';
  }
  $babelLink ='<a target="_blank" href="' .  $args['data-babel-link'] . '"><img src="http://babelnet.org/imgs/babelnet.png"></a>';

  $output = '<span role="button" class="btn btn-link" data-placement="auto bottom" data-html="true" id="'
  . $id . '" data-toggle="popover" data-trigger="focus" data-title ="<strong>'
  . $title . '</strong>" data-content="<p>'
  . $gloss . '</p><p>' . wfMessage( 'easylink-ve-dialog-gloss-source' )->inContentLanguage()
  . $glossSource
  . '</p><p>' . htmlspecialchars($babelLink);
  if($wikiLink){
  $output .= htmlspecialchars($wikiLink) . '">' . $title . '</span>';
}else{
$output .= '">' . $title . '</span>';
}*/

$output = '<easylink data-babelnet-id="'
. $babelnetId . '"  data-title="'
. $result->{'title'} . '" data-gloss="'
. $result->{'gloss'} . '" data-gloss-source="'
. $result->{'glossSource'} .'" data-babel-link="'
. $result->{'babelLink'} . '" ';
if($result->{'wikiLink'}){
  $output .=  'data-wiki-link="' . $result->{'wikiLink'} .'" >' . $input . '</easylink>';
}else{
  $output .= ' >' . $input . '</easylink>';
}
return $output;
}
}
