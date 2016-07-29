/* Create a dialog */
ve.ui.easyLinkEditDialog = function(fragment, annotation, config) {
  // Parent constructor
  ve.ui.easyLinkEditDialog.parent.call(this, config);
  this.annotation = annotation;
  this.fragment = fragment;
  this.inputWidget = this.createInputWidget();
  this.textareaWidget = this.createTextareaWidget();
  this.inputWidget.setValue(annotation.getWikiLink());
  this.textareaWidget.setValue(annotation.getGloss());
};

/* Inheritance */

OO.inheritClass(ve.ui.easyLinkEditDialog, OO.ui.ProcessDialog);

/* Static Properties */
ve.ui.easyLinkEditDialog.static.name = 'easyLinkEditDialog';
ve.ui.easyLinkEditDialog.static.title = 'Edit'
ve.ui.easyLinkEditDialog.static.size = 'large';
ve.ui.easyLinkEditDialog.static.actions = [{
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

/* Define actions */
ve.ui.easyLinkEditDialog.prototype.getActionProcess = function(action) {
  var dialogEdit = this;
  if (action === 'save') {
    return new OO.ui.Process(function() {
      var newGloss = dialogEdit.textareaWidget.getValue();
      var newWikiLink = dialogEdit.inputWidget.getValue();
      var newAnnotation = new ve.dm.easyLinkAnnotation({
        type: 'link/easyLink',
        attributes: {
          babelnetId: dialogEdit.annotation.getBabelnetId(),
          title: dialogEdit.annotation.getTitle(),
          gloss: newGloss,
          glossSource: 'WikiToLearn',
          babelLink: dialogEdit.annotation.getBabelLink(),
          wikiLink: newWikiLink
        }
      });
      dialogEdit.fragment.annotateContent('clear', dialogEdit.annotation);
      dialogEdit.fragment.annotateContent('set', newAnnotation);
      dialogEdit.close( { action: action } );
  }, this);
  }
return ve.ui.easyLinkEditDialog.super.prototype.getActionProcess.call(this, action);
};

/* Set the body height */
ve.ui.easyLinkEditDialog.prototype.getBodyHeight = function() {
  return 250;
};

/* Initialize the dialog elements */
ve.ui.easyLinkEditDialog.prototype.initialize = function() {
  ve.ui.easyLinkEditDialog.parent.prototype.initialize.call(this);
  /* Define panels */
  this.panelEdit = new OO.ui.PanelLayout({
    '$': this.$,
    'scrollable': true,
    'padded': true
  });

  this.inputSetLayout = new OO.ui.FieldsetLayout;
  this.inputSetLayout.addItems([
    this.inputWidget
  ]);

  /* Add elements to the panels */
  this.panelEdit.$element.append('<p>Edit the definition: </p>', this.textareaWidget.$element,
  "<br><p>Edit the link: </p>", this.inputSetLayout.$element
  );
  /* Add panels to StackLayout */
  this.stackLayout = new OO.ui.StackLayout({
    items: [this.panelEdit]
  });
  /* Add StackLayout to dialog body */
  this.$body.append(this.stackLayout.$element);
};

/* Set the default mode of the dialog */
ve.ui.easyLinkEditDialog.prototype.getSetupProcess = function(data) {
  return ve.ui.easyLinkEditDialog.super.prototype.getSetupProcess.call(this, data)
  .next(function() {
    this.actions.setMode('intro');
  }, this);
};

/**
 * Create a inputext to be used by the edit dialog widget
 *
 * @param {Object} [config] Configuration options
 * @return {OO.ui.Widget} Text input widget
 */
ve.ui.easyLinkEditDialog.prototype.createInputWidget = function ( config ) {
	return new OO.ui.TextInputWidget( $.extend( { validate: 'non-empty' }, config ) );
};

/**
 * Create a textarea to be used by the edit dialog widget
 *
 * @param {Object} [config] Configuration options
 * @return {OO.ui.Widget} Text input widget
 */
ve.ui.easyLinkEditDialog.prototype.createTextareaWidget = function ( config ) {
	return new OO.ui.TextInputWidget( $.extend( { validate: 'non-empty', multiline: true, rows: 5 }, config ) );
};

/* Registration Dialog*/
ve.ui.windowFactory.register(ve.ui.easyLinkEditDialog);
