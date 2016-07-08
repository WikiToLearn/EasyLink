/**
*
* @class
* @extends ve.ui.ToolbarDialog
*
* @constructor
* @param {Object} [config] Configuration options
*/
ve.ui.easyLinkToolbarDialog = function (){
// Parent constructor
ve.ui.easyLinkToolbarDialog.super.apply( this, arguments );

this.$element.addClass( 've-ui-easyLinkToolbarDialog' );

};

/* Inheritance */
OO.inheritClass(ve.ui.easyLinkToolbarDialog, ve.ui.ToolbarDialog);


/* Static properties */

ve.ui.easyLinkToolbarDialog.static.name = 'easyLinkToolbarDialog';

ve.ui.easyLinkToolbarDialog.static.size = 'full';

ve.ui.easyLinkToolbarDialog.static.padded = false;

ve.ui.easyLinkToolbarDialog.static.modelClasses = [ve.dm.easyLinkAnnotation];

/* Methods */

/* Set the body height */
ve.ui.easyLinkToolbarDialog.prototype.getBodyHeight = function() {
  return 300;
};

/**
* @inheritdoc
*/
ve.ui.easyLinkToolbarDialog.prototype.initialize = function () {
// Parent method
ve.ui.easyLinkToolbarDialog.super.prototype.initialize.call( this );
/*this.capsule = new OO.ui.FieldLayout( new OO.ui.CapsuleMultiSelectWidget( {
    selected: [ 'Option 1', 'Option 3' ],
    menu: {
        items: [
        new OO.ui.MenuOptionWidget( {
            data: 'Option 1',
            label: 'Option One'
        } ),
        new OO.ui.MenuOptionWidget( {
            data: 'Option 2',
            label: 'Option Two'
        } ),
        new OO.ui.MenuOptionWidget( {
            data: 'Option 3',
            label: 'Option Three'
        } ),
        new OO.ui.MenuOptionWidget( {
            data: 'Option 4',
            label: 'Option Four'
        } ),
        new OO.ui.MenuOptionWidget( {
            data: 'Option 5',
            label: 'Option Five'
        } )
        ]
    }
} ),{
    label: 'Annotations',
    align: 'top'
}
);
this.$body.append( this.capsule.$element );*/

this.clearAllButton = new OO.ui.ButtonWidget({
	label: 'Remove all',
	icon: 'remove',
	iconTitle: 'Remove all',
	flags: ['destructive']
});
this.confirmAllButton = new OO.ui.ButtonWidget({
	label: 'Confirm all',
	icon: 'check',
	iconTitle: 'Confirm all',
	flags: ['constructive']
});
this.$body.append( '<p>Clicca qui per rimuovere o aggiungere definitivamente tutte le annotazioni</p><br>',this.clearAllButton.$element, this.confirmAllButton.$element );
this.clearAllButton.connect(this, {
	click: 'onClearAllButtonClick'
});
this.confirmAllButton.connect(this, {
	click: 'onConfirmAllButtonClick'
});
};

/**
 * Handle clear all button click events.
 */
ve.ui.easyLinkToolbarDialog.prototype.onClearAllButtonClick = function() {
  var annotations = ve.dm.easyLinkAnnotation.static.annotationsList;
  this.removeAll(annotations);
};

/**
 * Handle confirm all button click events.
 */
ve.ui.easyLinkToolbarDialog.prototype.onConfirmAllButtonClick = function() {
  var annotations = ve.dm.easyLinkAnnotation.static.annotationsList;
  this.confirmAll(annotations);
};

/**
 * Add annotations to the service's database
 * @param annotations, an array with all current easyLinkAnnotation
 */
ve.ui.easyLinkToolbarDialog.prototype.confirmAll = function(annotations) {
  $.each(annotations, function(key, annotation){
    var attributes = annotation.getAttributes();
    var jsonToSend = JSON.stringify(attributes);
    $.post("/Special:EasyLink", {
      annotation : jsonToSend
    }, function(response, status) {
      if (status === 'success' && response) {
        alert("Stored!");
      }else {
        alert("Error! " + status);
      }
    });
  });
};

/**
 * Clear all annotations in the current document
 * @param annotations, an array with all current easyLinkAnnotation
 */
ve.ui.easyLinkToolbarDialog.prototype.removeAll = function(annotations) {
  var dialogToolbar = this;
  var veDmSurface = ve.init.target.getSurface().getModel();
  var veDmDocument = veDmSurface.getDocument();

	$.each(annotations, function(key, annotation){
		var title = annotation.getTitle();
  	var range = veDmDocument.findText(title, {
  		//noOverlaps: true,
  		caseSensitiveString: true,
  		wholeWord: true
  	});
    var selection = new ve.dm.LinearSelection(veDmDocument, range[0]);
    var fragment = new ve.dm.SurfaceFragment(veDmSurface, selection);
    dialogToolbar.applyToAnnotations(fragment, function(fragment, annotation) {
      fragment.annotateContent('clear', annotation);
    });
	});

  $.each(annotations, function(key, annotation){
    annotations.splice(annotations.indexOf(key));
  });
};

/**
 * Apply a callback to every modelClass annotation in the current fragment
 *
 * @param fragment, the fragment
 * @param  {Function} callback Callback, will be passed fragment and annotation
 */
ve.ui.easyLinkToolbarDialog.prototype.applyToAnnotations = function(fragment, callback) {
  var i, len,
    modelClasses = this.constructor.static.modelClasses,
    annotations = fragment.getAnnotations(true).filter(function(annotation) {
      return ve.isInstanceOfAny(annotation, modelClasses);
    }).get();
  if (!annotations.length &&
    fragment.getSelection().isCollapsed() &&
    fragment.getDocument().data.isContentOffset(fragment.getSelection().getRange().start)
  ) {
    // Expand to nearest word and try again
    fragment = fragment.expandLinearSelection('word');

    annotations = fragment.getAnnotations(true).filter(function(annotation) {
      return ve.isInstanceOfAny(annotation, modelClasses);
    }).get();
  }
  for (i = 0, len = annotations.length; i < len; i++) {
    callback(fragment.expandLinearSelection('annotation', annotations[i]), annotations[i]);
  }
};

/* Registration */

ve.ui.windowFactory.register( ve.ui.easyLinkToolbarDialog );
