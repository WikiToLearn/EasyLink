<?php
if ( !defined( 'MEDIAWIKI' ) ){
  die( );
}

class EasyLinkHooks{

  public static function onParserFirstCallSetup( Parser $parser ) {
    $parser->setHook( 'easylink', 'EasyLinkHooks::easyLinkRender' );
    return true;
  }

/**
* @param OutputPage $out
* @param Skin $skin
* @return bool Always true
*/
public static function onBeforePageDisplay(OutputPage $out, Skin $skin) {
  $out->addModules(['ext.easyLink']);
  return true;
}

static function easyLinkRender( $input, array $args, Parser $parser, PPFrame $frame ) {
  $parser->disableCache();

  $babelnetId = $args['data-babelnet-id'];
  $glossSource = $args['data-gloss-source'];

  $resultJSON = SpecialEasyLink::forwardGetAnnotation($babelnetId, $glossSource);
  $result = json_decode($resultJSON);

  $output = '<span class="easylink" data-babelnet-id="'
  . $babelnetId . '"  data-title="'
  . $result->title . '" data-gloss="';

  $glosses = $result->glosses;

  foreach($glosses as $value){
    if(strcmp($value->glossSource, $glossSource) == 0){
      $output .= $value->gloss . '" data-gloss-source="'
      . $value->glossSource .'"';
      break;
    }
  }

  $output .=  ' data-babel-link="' . $result->babelLink . '" ';

  if($result->wikiLink){
    $output .=  'data-wiki-link="' . $result->wikiLink .'" >' . $input . '</span>';
  }else{
    $output .= ' >' . $input . '</span>';
  }
  return $output;
}
}
