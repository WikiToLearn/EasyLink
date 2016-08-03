/*!
 * VisualEditor UserInterface easyLinkEditDialog2 class.
 *
 * @copyright 2011-2016 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * Inspector for inserting special characters.
 *
 * @class
 * @extends ve.ui.ToolbarDialog
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
ve.ui.easyLinkEditDialog2 = function VeUieasyLinkEditDialog2(fragment, annotation, config) {
	// Parent constructor
	ve.ui.easyLinkEditDialog2.super.apply( this, config );
  this.pages = null;
  this.annotation = annotation;
  this.fragment = fragment;
	this.$element.addClass( 've-ui-easyLinkEditDialog2' );
};

/* Inheritance */

OO.inheritClass( ve.ui.easyLinkEditDialog2, OO.ui.ProcessDialog );

/* Static properties */

ve.ui.easyLinkEditDialog2.static.name = 'easyLinkEditDialog2';
ve.ui.easyLinkEditDialog2.static.size = 'large';
ve.ui.easyLinkEditDialog2.static.title = 'Edit';
ve.ui.easyLinkEditDialog2.static.actions = [{
  'action': 'save',
  'label': 'Done',
  'flags': ['primary', 'constructive'],
  'modes': 'intro',
  'icon': 'check'
}, {
  'label': OO.ui.deferMsg('visualeditor-dialog-action-cancel'),
  'flags': 'safe',
  'modes': 'intro',
  'icon': 'close'
}];


/* Methods */

/**
 * @inheritdoc
 */
ve.ui.easyLinkEditDialog2.prototype.initialize = function () {
	// Parent method
	ve.ui.easyLinkEditDialog2.super.prototype.initialize.call( this );
};

/**
 * @inheritdoc
 */
ve.ui.easyLinkEditDialog2.prototype.getReadyProcess = function ( data ) {
	data = data || {};
	return ve.ui.easyLinkEditDialog2.super.prototype.getReadyProcess.call( this, data )
		.next( function () {
			if ( !this.pages ) {
        this.buildPages();
			}
		}, this );
};

/* Set the body height */
ve.ui.easyLinkEditDialog2.prototype.getBodyHeight = function() {
  return 300;
};

/* Define actions */
ve.ui.easyLinkEditDialog2.prototype.getActionProcess = function(action) {
  var dialogEdit = this;
  if (action === 'save') {
    return new OO.ui.Process(function() {
      var newGloss = dialogEdit.bookletLayout.getPage('glosses').$glossText.text();
      var newGlosses = [];
      $.each(dialogEdit.annotation.getGlosses(), function(key, value){
        newGlosses.push(value);
      })
      var newWikiLink = null;
      if(dialogEdit.bookletLayout.getPage('wikiLink')){
        newWikiLink = dialogEdit.bookletLayout.getPage('wikiLink').inputWidget.getValue();
      }
      var newGlossSource = dialogEdit.bookletLayout.getPage('glosses').dropdownWidget.getMenu().getSelectedItem().getLabel();
      if(!dialogEdit.bookletLayout.getPage('glosses').dropdownWidget.getMenu().getItemFromLabel(newGlossSource) || newGlossSource === 'WikiToLearn'){
        newGlosses.push({gloss: newGloss, glossSource: newGlossSource});
      }
      var newAnnotation = new ve.dm.easyLinkAnnotation({
        type: 'link/easyLink',
        attributes: {
          babelnetId: dialogEdit.annotation.getBabelnetId(),
          title: dialogEdit.annotation.getTitle(),
          gloss: newGloss,
          glossSource: newGlossSource,
          glosses: newGlosses,
          babelLink: dialogEdit.annotation.getBabelLink(),
          wikiLink: newWikiLink
        }
      });
      dialogEdit.fragment.annotateContent('clear', dialogEdit.annotation);
      dialogEdit.fragment.annotateContent('set', newAnnotation);
      dialogEdit.close( { action: action } );
  }, this);
  }
return ve.ui.easyLinkEditDialog2.super.prototype.getActionProcess.call(this, action);
};

/**
 * Builds the pages
 */
ve.ui.easyLinkEditDialog2.prototype.buildPages = function () {
	this.bookletLayout = new OO.ui.BookletLayout( {
		outlined: true,
		continuous: false
	} );
	this.pages = [];
  var annotationKeys = Object.keys(this.annotation.getAttributes());
  for(i=0; i<annotationKeys.length; i++){
    if(this.testAnnotationKeys(annotationKeys[i], this.annotation)){
      this.pages.push(
  			new ve.ui.easyLinkPage( annotationKeys[i], {
  				label: annotationKeys[i],
  				attribute: this.annotation.getAttribute(annotationKeys[i]),
					babelnetId: this.annotation.getBabelnetId()
  			} )
  		);
    }
  }
	this.bookletLayout.addPages( this.pages );
	this.$body.append( this.bookletLayout.$element );

	this.updateSize();
};

ve.ui.easyLinkEditDialog2.prototype.testAnnotationKeys = function(annotationKey, annotation){
	if(annotationKey === 'glosses' || (annotationKey === 'wikiLink' && annotation.getAttribute(annotationKey))){
		return true;
	}
	return false;
}

/* Registration */

ve.ui.windowFactory.register( ve.ui.easyLinkEditDialog2 );
