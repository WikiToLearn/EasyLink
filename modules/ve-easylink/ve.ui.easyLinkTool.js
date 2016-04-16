( function () {

  /* Create a tool */
  ve.ui.easyLinkTool = function easyLinkTool( toolGroup, config ) {
  // parent constructor
  ve.ui.easyLinkTool.super.apply( this, arguments );
  // the tool should be enabled by default, enable it
  this.setDisabled( false );
}
/* Inherit ve.ui.Tool */
OO.inheritClass( ve.ui.easyLinkTool, ve.ui.Tool );

/*Static properties */
ve.ui.easyLinkTool.static.name = 'easyLink';
ve.ui.easyLinkTool.static.icon = 'tag';
ve.ui.easyLinkTool.static.title = OO.ui.deferMsg( 'easylink-ve-toolname' );
// don't add the tool to a named group automatically
ve.ui.easyLinkTool.static.autoAddToGroup = false;
// prevent this tool to be added to a catch-all group (*),
//although this tool isn't added to a group
ve.ui.easyLinkTool.static.autoAddToCatchall = false;

/* onSelect is the handler for a click on the tool, open the dialog */
ve.ui.easyLinkTool.prototype.onSelect = function () {
  this.toolbar.getSurface().execute( 'window', 'open', 'easyLinkDialog', null );
};

ve.ui.easyLinkTool.prototype.onUpdateState = function () {
  this.setActive( false );
};

/* Registration of the tool using toolFactory */
ve.ui.toolFactory.register( ve.ui.easyLinkTool );
// Add this tool to the toolbar
ve.init.mw.Target.static.toolbarGroups.push( {
  // this will create a new toolgroup with the tools
  // named in this include directive. The name is the name given
  // in the static property of the tool
  include: [ 'easyLink' ]
} );
} )();