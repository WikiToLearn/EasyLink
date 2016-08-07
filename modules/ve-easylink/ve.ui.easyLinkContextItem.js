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

  // Properties
  this.$head = $( '<div>' );
  this.$title = $( '<div>' );
  this.$actions = $( '<div>' );
  this.$body = $( '<div>' );
  this.$info = $( '<div>' );
  this.$description = $( '<div>' );

  this.actionButtons.clearItems();

  this.clearButton = new OO.ui.ButtonWidget({
    label: 'Remove',
    icon: 'remove',
    iconTitle: 'Remove',
    flags: ['destructive']
  });
  this.addButton = new OO.ui.ButtonWidget({
    label: 'Add',
    icon: 'add',
    iconTitle: 'Add',
    flags: ['constructive']
  });

  this.editButton = new OO.ui.ButtonWidget({
    icon: 'edit',
    framed: false,
    classes: ['pull-right'],
    iconTitle: 'Edit'
  });

  this.nextButton = new OO.ui.ButtonWidget({
    framed: false,
    classes: ['pull-right'],
    icon: 'next',
    iconTitle: 'Next'
  });

  if (this.isClearable() && this.isEditable()) {
    this.actionButtons.addItems([this.clearButton], 0);
    this.actionButtons.addItems([this.addButton], 1);
  }

  // Initialization
  this.$label.addClass( 've-ui-linearContextItem-label' );
  this.$icon.addClass( 've-ui-linearContextItem-icon' );
  this.$description.addClass( 've-ui-linearContextItem-description' );
  this.$info
  .addClass( 've-ui-linearContextItem-info' )
  .append( this.$description);
  this.$title
  .addClass( 've-ui-linearContextItem-title' )
  .append( this.$icon, this.$label );
  this.$actions
  .addClass( 've-ui-linearContextItem-actions' )
  .append( this.actionButtons.$element );
  this.$head
  .addClass( 've-ui-linearContextItem-head' )
  .append( this.$title, this.$info, this.$actions );
  this.$body.addClass( 've-ui-linearContextItem-body' );
  this.$element
  .addClass( 've-ui-linearContextItem' )
  .append( this.$head, this.nextButton.$element, this.$body, this.editButton.$element );

  //Events
  this.clearButton.connect(this, {
    click: 'onClearButtonClick'
  });
  this.addButton.connect(this, {
    click: 'onAddButtonClick'
  });
  this.editButton.connect(this, {
    click: 'onEditButtonClick'
  });
  this.nextButton.connect(this, {
    click: 'onNextIndicatorClick'
  });
};

/* Inheritance */

OO.inheritClass(ve.ui.easyLinkContextItem, ve.ui.LinearContextItem);

/* Static Properties */

ve.ui.easyLinkContextItem.static.name = 'link/easyLink';

ve.ui.easyLinkContextItem.static.icon = 'tag';

ve.ui.easyLinkContextItem.static.label = OO.ui.deferMsg('easylink-ve-toolname');

ve.ui.easyLinkContextItem.static.modelClasses = [ve.dm.easyLinkAnnotation];

ve.ui.easyLinkContextItem.static.embeddable = true;

ve.ui.easyLinkContextItem.static.commandName = 'link/easyLink';

ve.ui.easyLinkContextItem.static.editable = true;

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
* Check if item is editable.
*
* @return {boolean} Item is clearable
*/
ve.ui.easyLinkContextItem.prototype.isEditable = function() {
  return this.constructor.static.editable;
};


/**
* Handle clear button click events.
* Removes any modelClasses annotations from the current fragment
*/
ve.ui.easyLinkContextItem.prototype.onClearButtonClick = function() {
  var annotations = ve.dm.easyLinkAnnotation.static.annotationsList;
  this.applyToAnnotations(function(fragment, annotation) {
    fragment.annotateContent('clear', annotation);
    annotations.splice(annotations.indexOf(annotation));
  });
};

/**
* Handle edit button click events.
* Edit the annotation in the current fragment
*/
ve.ui.easyLinkContextItem.prototype.onEditButtonClick = function() {
  this.applyToAnnotations(function(fragment, annotation) {
    var editDialog = new ve.ui.easyLinkEditDialog2(fragment, annotation);
    var windowManager = ve.init.target.getSurface().getDialogs();
    windowManager.addWindows([editDialog]);
    windowManager.openWindow(editDialog);
  });
};

/**
* Handle add button click events.
* Add this annotation to service's database
*/
ve.ui.easyLinkContextItem.prototype.onAddButtonClick = function() {
  this.applyToAnnotations(function(fragment, annotation) {
    var attributes = annotation.getAttributes();
    var jsonToSend = JSON.stringify(attributes);
    var pageName = mw.config.get('wgPageName');
    var username = mw.config.get('wgUserName');
    $.post("/Special:EasyLink", {
      command: 'storeAnnotation',
      annotation : jsonToSend,
      username : username,
      pageName: pageName
    }, function(response, status) {
      if (status === 'success' && response) {
        alert("Stored!");
      }
    });
  });
};

ve.ui.easyLinkContextItem.prototype.onNextIndicatorClick = function(){
  console.log("clicked");
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
  + "</p><p>"
  + "<a target='_blank' href='"
  + descriptionObj.babelLink
  + "'><img src='http://babelnet.org/imgs/babelnet.png'></a>";
  if(descriptionObj.wikiLink){
    description += "<a target='_blank' href='"
    + descriptionObj.wikiLink + "'><img src='http://image005.flaticon.com/28/png/16/33/33949.png'></a></p>";
  }else{
    description += "</p>";
  }
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
