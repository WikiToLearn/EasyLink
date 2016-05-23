<?php
if ( !defined( 'MEDIAWIKI' ) ){
    die( );
}

class EasyLinkHooks{

    function onParserFirstCallSetup( Parser $parser ) {
        $parser->setHook( 'span', 'EasyLinkHooks::easyLinkRender' );
        return true;
    }

    static function easyLinkRender( $input, array $args, Parser $parser, PPFrame $frame ) {
        $parser->disableCache();
        $parser->enableOOUI(true);
        /*
        $attr = array();  
        //This time, make a list of attributes and their values, and dump them, along with the user input
        foreach( $args as $name => $value )
            $attr[] = '<strong>' . htmlspecialchars( $name ) . '</strong> = ' . htmlspecialchars( $value );
        return implode( '<br />', $attr ) . "\n\n" . htmlspecialchars( $input );*/

        $id = $args['id'];
        $title = $args['data-title'];
        $gloss = $args['data-gloss'];
        $glossSource = $args['data-gloss-source'];
        if($args['data-wiki-link'] != 'undefined'){
            $wikiLink =  '<a target="_blank" href="' . $args['data-wiki-link'] . '"><img src="http://image005.flaticon.com/28/png/16/33/33949.png"></a>';
        }
        $babelLink ='<a target="_blank" href="' .  $args['data-babel-link'] . '"><img src="http://babelnet.org/imgs/babelnet.png"></a>';
        

/*       $button = new OOUI\ButtonWidget( array(
    'id' => 'myButton',
    'framed' => false,
    'infusable' => true,
    'label' => $title,
    'target' => 'blank',
    'href' => 'http://example.com'
) );
        return $button;*/
       $output = '<a tabindex="0" role="button" class="btn btn-link" data-placement="auto bottom" data-html="true" id="' 
        . $id . '" data-toggle="popover" data-trigger="focus" data-title ="<strong>' 
        . $title . '</strong>" data-content="<p>' 
        . $gloss . '</p><p>' . wfMessage( 'easylink-ve-dialog-gloss-source' )->inContentLanguage()
        . $glossSource 
        . '</p><p>' . htmlspecialchars($babelLink);
        if($wikiLink){
            $output .= htmlspecialchars($wikiLink) . '">' . htmlspecialchars($input) . '</a>';
        }else{
             $output .= '">' . htmlspecialchars($input) . '</a>';
        }
        return $output;
    }
}