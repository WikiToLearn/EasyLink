/* Get the Wikitext */
function getWikitext(callback){
  var dom = ve.init.target.getSurface().getDom();
  ve.init.target.serialize(dom, function (wikitext) {
    //var noMath = wikitext.replace(/<math>.*<\/math>/g, '');
    //var cleanText = noMath.replace(/<dmath>\n*.*\n*<\/dmath>/g, '');
    callback(wikitext);
  });
}

/* Get HTML text or HTML with tags 
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
})();*/

/* Send Wikitext to EasyLinkAPI and retrieve annotations */
var analyze = function(callbackProva){
  getWikitext(function(wikitext){
  $.post("http://it.tuttorotto.biz/Special:EasyLink", {wikitext : wikitext}, function(response, status) {
    if (status === 'success' && response) {
      callbackProva(response);
    }
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
  var dialog = this;
  if ( action === 'analyze' ) {
    dialog.fieldProgress.toggle(true);
   return new OO.ui.Process( function () {
     analyze(function(results){
      if(results){
        dialog.pollingAPI(results);
/*        $.when(dialog.showResults(results)).done(function(){
          dialog.fieldProgress.toggle(false);
          dialog.actions.setMode('results');
          dialog.stackLayout.setItem(dialog.panelResults);
        });*/
      }
    });
  }, this );
} else if (action === 'help') {
  this.actions.setMode('help');
//Show help panel
this.stackLayout.setItem( this.panelHelp );

} else if (action === 'back') {
  this.actions.setMode('intro');
//Show intro panel
this.stackLayout.setItem( this.panelIntro );
}
return ve.ui.MWMediaDialog.super.prototype.getActionProcess.call( this, action );
};

/* Set the body height */
ve.ui.easyLinkDialog.prototype.getBodyHeight = function () {
  return 250;
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
  'modes': 'intro',
  'icon' : 'search'
},
{
  'label': OO.ui.deferMsg( 'visualeditor-dialog-action-cancel' ),
  'flags': 'safe',
  'modes': 'intro',
  'icon' : 'close'
},
{
  'action': 'back',
  'label': OO.ui.deferMsg( 'visualeditor-dialog-action-goback' ),
  'flags': 'safe',
  'modes': ['help', 'results'],
  'icon' : 'undo'
},
{
  'action': 'help',
  'label': OO.ui.deferMsg( 'visualeditor-help-tool' ),
  'modes': 'intro',
  'icon': 'help'
}
];

/* Initialize the dialog elements */
ve.ui.easyLinkDialog.prototype.initialize = function () {
  ve.ui.easyLinkDialog.super.prototype.initialize.call( this );
//Define panels
this.panelIntro = new OO.ui.PanelLayout( { '$': this.$, 'scrollable': true, 'padded': true } );
this.panelHelp = new OO.ui.PanelLayout( { '$': this.$, 'scrollable': true, 'padded': true } );
this.panelResults = new OO.ui.PanelLayout({ 
  '$': this.$,
  'scrollable': true,
  'padded': true
});

this.progressBar = new OO.ui.ProgressBarWidget({progress: 0});
this.fieldProgress = new OO.ui.FieldsetLayout;
this.fieldProgress.addItems( [
   new OO.ui.FieldLayout( this.progressBar, {label: OO.ui.deferMsg( 'easylink-ve-dialog-progress-text' ), align: 'top'})
] );
this.fieldProgress.toggle(false);

//Add elements to the panels
this.panelIntro.$element.append(OO.ui.deferMsg( 'easylink-ve-dialog-intro-text' ),'<br><br>', this.fieldProgress.$element);
this.panelHelp.$element.append(OO.ui.deferMsg( 'easylink-ve-dialog-help-text' ));
//Add panels to the layout
this.stackLayout= new OO.ui.StackLayout( {
  items: [ this.panelIntro, this.panelHelp, this.panelResults ]
} ); 
this.$body.append( this.stackLayout.$element );
};

/* Set the default mode of the dialog */
ve.ui.easyLinkDialog.prototype.getSetupProcess = function ( data ) {
  return ve.ui.easyLinkDialog.super.prototype.getSetupProcess.call( this, data )
  .next( function () {
    this.actions.setMode( 'intro' );
  }, this );
};

ve.ui.easyLinkDialog.prototype.pollingAPI = function(requestId){
  var dialog = this;
  $.get("http://it.tuttorotto.biz/Special:EasyLink?id=" + requestId, function(response, status) {
    var responseObj = JSON.parse(response);
    if(responseObj.status === 'Progress' || response.status === 'Pending'){
      dialog.progressBar.setProgress(responseObj.progress);
      setTimeout(function() {
        dialog.pollingAPI(responseObj.id);
      }, (3 * 1000));
    }else{
      dialog.showResults(responseObj.results);
    }
  });
}

ve.ui.easyLinkDialog.prototype.showResults = function (results){
  var dialog = this;
  dialog.panelResults.$element.empty();
  console.warn(results);
  $.each(results, function(key, val) {
    var babelLink = val['babelLink'];
    var wikiLink = val['wikiLink'];
    var gloss = val['gloss'];
    var name = val['name'];
    var glossSource = val['glossSource'];
    //var entity = "<a href='" + babelLink + "'>" + name + "</a>: " + gloss + "<br>";
    var popup = new OO.ui.PopupButtonWidget( {
            label: name,
            framed: false,
            popup: {
              head: true,
              label: $('<p><strong>' + name + '</strong></p>'),
              $content: $('<p>' + gloss + '</p><p>' + OO.ui.msg( 'easylink-ve-dialog-gloss-source' ) + glossSource + '</p>'),
              $footer: $("<p><a target='_blank' href='" + babelLink + "'><img src='http://babelnet.org/imgs/babelnet.png'></a>"
                + "<a target='_blank' href='" + wikiLink + "'><img src='http://image005.flaticon.com/28/png/16/33/33949.png'></a></p>"),
              padded: true,
              framed: true,
              align: 'forwards'
            }
          } );
    dialog.panelResults.$element.append(popup.$element, '<br>');
  });

 dialog.fieldProgress.toggle(false);
          dialog.actions.setMode('results');
          dialog.stackLayout.setItem(dialog.panelResults);
};

/* Registration Dialog*/
ve.ui.windowFactory.register( ve.ui.easyLinkDialog );