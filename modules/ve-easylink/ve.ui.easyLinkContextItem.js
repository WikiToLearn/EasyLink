/**
 *
 * @class
 * @extends ve.ui.LinearContextItem
 *
 * @param {ve.ui.Context} context Context item is in
 * @param {ve.dm.Model} model Model item is related to
 * @param {Object} config Configuration options
 */
ve.ui.easyLinkContextItem = function(context, model, config) {
  // Parent constructor
  ve.ui.easyLinkContextItem.super.call(this, context, model, config);

  // Initialization
  this.$element.addClass('ve-ui-easyLinkContextItem');

  this.actionButtons.clearItems();

  if (!this.context.isMobile()) {
    this.clearButton = new OO.ui.ButtonWidget({
      label: 'Remove',
      icon: 'remove',
      iconTitle: 'Remove',
      flags: ['destructive']
    });
    this.editButton = new OO.ui.ButtonWidget({
      label: 'Edit',
      icon: 'edit',
      iconTitle: 'Edit',
      flags: ['progressive']
    });
  } else {
    this.clearButton = new OO.ui.ButtonWidget({
      framed: false,
      icon: 'remove',
      flags: ['destructive']
    });
  }
  if (this.isClearable()) {
    this.actionButtons.addItems([this.clearButton], 0);
    this.actionButtons.addItems([this.editButton], 1);
  }
  this.clearButton.connect(this, {
    click: 'onClearButtonClick'
  });
  this.editButton.connect(this, {
    click: 'onEditButtonClick'
  });
};

/* Inheritance */

OO.inheritClass(ve.ui.easyLinkContextItem, ve.ui.LinearContextItem);

/* Static Properties */

ve.ui.easyLinkContextItem.static.name = 'easyLink';

ve.ui.easyLinkContextItem.static.icon = 'tag';

ve.ui.easyLinkContextItem.static.label = OO.ui.deferMsg('easylink-ve-toolname');

ve.ui.easyLinkContextItem.static.modelClasses = [ve.dm.easyLinkAnnotation];

ve.ui.easyLinkContextItem.static.embeddable = true;

ve.ui.easyLinkContextItem.static.commandName = 'link/easyLink';

ve.ui.easyLinkContextItem.static.clearable = true;

/* Methods */

/* Render body of the context item */
ve.ui.easyLinkContextItem.prototype.renderBody = function() {
  this.$body.html(this.getDescription());
};

/**
 * Check if item is clearable.
 *
 * @return {boolean} Item is clearable
 */
ve.ui.easyLinkContextItem.prototype.isClearable = function() {
  return this.constructor.static.clearable;
};

/**
 * Handle clear button click events.
 *
 * @localdoc Removes any modelClasses annotations from the current fragment
 *
 * @protected
 */
ve.ui.easyLinkContextItem.prototype.onClearButtonClick = function() {
  this.applyToAnnotations(function(fragment, annotation) {
    fragment.annotateContent('clear', annotation);
  });
};

/**
 * Handle edit button click events.
 * Show the inspector and its widget
 */
ve.ui.easyLinkContextItem.prototype.onEditButtonClick = function() {
  ve.init.target.getSurface().execute('window', 'open', 'link/easyLink');
  /*var command = this.getCommand();
	if ( command ) {
		command.execute( this.context.getSurface() );
		this.emit( 'command' );
	}*/
};

/**
 * Get description of the annotation from the model
 */
ve.ui.easyLinkContextItem.prototype.getDescription = function() {
  var descriptionObj = ve.ce.easyLinkAnnotation.static.getDescription(this.model);
  var description = "<p><strong>"
                    + descriptionObj.title.toUpperCase()
                    + ":</strong></p><p>"
                    + descriptionObj.gloss
                    + "</p><p>"
                    + OO.ui.msg('easylink-ve-dialog-gloss-source')
                    + descriptionObj.glossSource
                    + "</p>";
  return description;
};

/**
 * Apply a callback to every modelClass annotation in the current fragment
 *
 * @param  {Function} callback Callback, will be passed fragment and annotation
 */
ve.ui.easyLinkContextItem.prototype.applyToAnnotations = function(callback) {
  var i, len,
    modelClasses = this.constructor.static.modelClasses,
    fragment = this.getFragment(),
    annotations = fragment.getAnnotations(true).filter(function(annotation) {
      return ve.isInstanceOfAny(annotation, modelClasses);
    }).get();
    console.warn(annotations);
    console.warn(fragment);
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

ve.ui.contextItemFactory.register(ve.ui.easyLinkContextItem);
