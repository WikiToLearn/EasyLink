/* Remove math and dmath tags from wikitext*/
function getCleanWikitext(callback){
  var dom = ve.init.target.getSurface().getDom();
  ve.init.target.serialize(dom, function (wikitext) {
    var noMath = wikitext.replace(/<math>.*<\/math>/g, '');
    var cleanText = noMath.replace(/<dmath>\n*.*\n*<\/dmath>/g, '');
    callback(cleanText);
  });
}

/* Get HTML text or HTML with tags */
var HTML = (function(){
  var getText = function(){
    var _DOMObj = ve.init.target.getSurface().getDom();
    console.warn("###outerTEXT###");
    return _DOMObj.body.outerText;
  };
  var getHTMLToString = function(){
    var _DOMObj = ve.init.target.getSurface().getDom();
    console.warn("###outerHTML###");
    return _DOMObj.body.outerHTML;
  };
  return{
    getText : getText,
    getHTMLToString : getHTMLToString
  };
})();

/* Send clean wikitext to BabelFy API and retrieve annotations */
var analyze = function(){
var _lang = 'IT';
var _key = apiKey.key;
var _service_url = 'https://babelfy.io/v1/disambiguate';

getCleanWikitext(function(cleanText){
  console.log("cleanText: " + cleanText);
  var _params = {
    'text'   : cleanText,
    'lang' : _lang,
    'key'  : _key
  };

  $.getJSON(_service_url + "?", _params, function(response) {

    $.each(response, function(key, val) {

        // retrieving token fragment
        var tokenFragment = val['tokenFragment'];
        var tfStart = tokenFragment['start'];
        var tfEnd = tokenFragment['end'];

        var tfragment = "Start token fragment: " + tfStart
        + "<br/>" + "End token fragment: " + tfEnd;
        console.log(tfragment);

        // retrieving char fragment
        var charFragment = val['charFragment'];
        var cfStart = charFragment['start'];
        var cfEnd = charFragment['end'];

        var cfragment = "Start char fragment: " + cfStart
        + "<br/>" + "End char fragment: " + cfEnd;
        console.log(cfragment);

        // retrieving BabelSynset ID
        var synsetId = val['babelSynsetID'];
        var id = "BabelNet Synset id: " + synsetId;
        console.log(id);
      });
  });
});
};

/* Create a dialog */
ve.ui.easyLinkDialog = function( manager, config ) {
// Parent constructor
ve.ui.easyLinkDialog.super.call( this, manager, config );

};

/* Inheritance */

OO.inheritClass( ve.ui.easyLinkDialog, ve.ui.FragmentDialog );

ve.ui.easyLinkDialog.prototype.getActionProcess  = function ( action ) {
  if ( action === 'analyze' ) {
    return new OO.ui.Process( function () {
    analyze();
  }, this );
  } else if (action === 'help') {
    this.actions.setMode('help');
//Show help panel
this.stackLayout.setItem( this.panelHelp );

} else if (action === 'back') {
  this.actions.setMode('read');
//Show intro panel
this.stackLayout.setItem( this.panelIntro );
}
return ve.ui.MWMediaDialog.super.prototype.getActionProcess.call( this, action );
};

/* Set the body height */
ve.ui.easyLinkDialog.prototype.getBodyHeight = function () {
  return 200;
};

/* Static Properties */
ve.ui.easyLinkDialog.static.name = 'easyLinkDialog';
ve.ui.easyLinkDialog.static.title = OO.ui.deferMsg( 'easylink-ve-dialog-title' );
ve.ui.easyLinkDialog.static.size = 'large';
ve.ui.easyLinkDialog.static.actions = [
{
  'action': 'analyze',
  'label': OO.ui.deferMsg( 'easylink-ve-dialog-analyze' ),
  'flags': ['primary','constructive'],
  'modes': 'read'
},
{
  'label': OO.ui.deferMsg( 'visualeditor-dialog-action-cancel' ),
  'flags': 'safe',
  'modes': 'read'
},
{
  'action': 'back',
  'label': OO.ui.deferMsg( 'visualeditor-dialog-action-goback' ),
  'flags': 'safe',
  'modes': 'help'
},
{
  'action': 'help',
  'label': OO.ui.deferMsg( 'visualeditor-help-tool' ),
  'modes': 'read',
  'icon': 'help'
}
];

/* Initialize the dialog elements */
ve.ui.easyLinkDialog.prototype.initialize = function () {
  ve.ui.easyLinkDialog.super.prototype.initialize.call( this );
  //Define panels
  this.panelIntro = new OO.ui.PanelLayout( { '$': this.$, 'scrollable': true, 'padded': true } );
  this.panelHelp = new OO.ui.PanelLayout( { '$': this.$, 'scrollable': true, 'padded': true } );
  //Define inputs fieldset
  this.inputsFieldset = new OO.ui.FieldsetLayout( {
    '$': this.$
  } );
  // input from
  this.tryInput = new OO.ui.TextInputWidget(
    { '$': this.$, 'multiline': false, 'placeholder': OO.ui.deferMsg( 'easylink-ve-dialog-input-placeholder' ) }
    );
  //Label from input
  this.inputField= new OO.ui.FieldLayout( this.tryInput, {
    '$': this.$,
    'label': OO.ui.deferMsg( 'easylink-ve-dialog-input-label' )
  } );

  //Checkbox
  this.tryCheckbox = new OO.ui.CheckboxInputWidget( {
    '$': this.$
  } );

  //Label checkbox
  var checkboxField= new OO.ui.FieldLayout( this.tryCheckbox, {
    '$': this.$,
    'align': 'inline',
    'label': OO.ui.deferMsg( 'easylink-ve-dialog-checkbox-label' )
  } );
  //Add inputs to the fieldset
  this.inputsFieldset.$element.append(
    this.inputField.$element,
    checkboxField.$element
    );
  //Add elements to the panels
  this.panelIntro.$element.append( this.inputsFieldset.$element );
  this.panelHelp.$element.append('<p>This is an help text!</p>');
  //Add panels to the layout
  this.stackLayout= new OO.ui.StackLayout( {
    items: [ this.panelIntro, this.panelHelp ]
  } ); 
  this.$body.append( this.stackLayout.$element );
};

/* Set the default mode of the dialog */
ve.ui.easyLinkDialog.prototype.getSetupProcess = function ( data ) {
  return ve.ui.easyLinkDialog.super.prototype.getSetupProcess.call( this, data )
  .next( function () {
    this.actions.setMode( 'read' );
  }, this );
};

/* Registration Dialog*/
ve.ui.windowFactory.register( ve.ui.easyLinkDialog );