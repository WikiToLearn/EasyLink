<?php
/*Entry point */
if (!defined('MEDIAWIKI')){
    die();
}
if(function_exists('wfLoadExtension')) {
    wfLoadExtension('EasyLink');
    
    wfWarn( "Deprecated entry point to EasyLink. Please use wfLoadExtension('EasyLink').");
    
}
else
{
    die("MediaWiki version 1.25+ is required to use the EasyLink extension");
}
?>