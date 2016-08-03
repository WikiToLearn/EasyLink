/**
 * MediaWiki meta dialog Languages page.
 *
 * @class
 * @extends OO.ui.PageLayout
 *
 * @constructor
 * @param {string} name Unique symbolic name of page
 * @param {Object} [config] Configuration options
 */
ve.ui.easyLinkPage = function ( name, config ) {

	// Parent constructor
	OO.ui.PageLayout.call( this, name, config );

	this.label = config.label;
	this.attribute = config.attribute;
	this.babelnetId = config.babelnetId;
  this.inputWidget = null;
  if(this.label === 'wikiLink'){
    this.inputWidget = this.createInputWidget();
    this.inputWidget.setValue(this.attribute);
    this.$textDiv = $( '<div>' ).append(this.inputWidget.$element);
  }else if(this.label === 'glosses'){
    this.inputWidget = this.createTextareaWidget();
    //this.inputWidget.setValue(this.attribute[0].gloss);
    this.$glossText = $('<p>').html(this.attribute[0].gloss);
    this.$textDiv = $( '<div>' ).append(this.$glossText);
    this.dropdownWidget = this.createDropdown();
    this.dropdownWidget.getMenu().selectItemByLabel(this.attribute[0].glossSource);
    this.fieldLayout = new OO.ui.FieldLayout(this.dropdownWidget, {
      label: 'Source: ',
      align: 'top'
    } );
    this.addButton = new OO.ui.ButtonWidget( {
      label: 'Add a WikiToLearn gloss',
      icon: 'add',
      iconTitle: 'Add'
    } );
    this.confirmButton = new OO.ui.ButtonWidget( {
      label: 'Confirm',
      icon: 'check',
      iconTitle: 'Confirm'
    } );
		this.getMoreButton = new OO.ui.ButtonWidget( {
      label: 'Get more!',
      icon: 'search',
      iconTitle: 'GetMore'
    } );
    this.$textDiv.append(
			this.inputWidget.$element,
			this.fieldLayout.$element,
			this.addButton.$element,
			this.getMoreButton.$element,
			this.confirmButton.$element
		);
    this.inputWidget.toggle();
    this.confirmButton.toggle();
    this.addButton.connect(this, {'click': 'onAddButtonClick'});
    this.confirmButton.connect(this, {'click': 'onConfirmButtonClick'});
    this.dropdownWidget.connect(this, {'labelChange': 'onLabelChange'});
		this.getMoreButton.connect(this, {'click': 'onGetMoreButtonClick'});
  }
	this.$element
		.addClass( 've-ui-easyLinkPage' )
		.append( $( '<h3>' ).text( name ), this.$textDiv );
};

/* Inheritance */

OO.inheritClass( ve.ui.easyLinkPage, OO.ui.PageLayout );

/* Methods */

ve.ui.easyLinkPage.prototype.onLabelChange = function(){
  var gloss = this.dropdownWidget.getMenu().getSelectedItem().getData();
  this.$glossText.html(gloss);
};

ve.ui.easyLinkPage.prototype.onAddButtonClick = function(){
  this.$glossText.hide();
  this.inputWidget.toggle();
  this.fieldLayout.toggle();
  this.addButton.toggle();
  this.confirmButton.toggle();
	this.getMoreButton.toggle();
};

ve.ui.easyLinkPage.prototype.onConfirmButtonClick = function() {
  var newGloss = this.inputWidget.getValue();
  this.inputWidget.toggle();
  this.$glossText.html(newGloss);
  this.$glossText.show();
  this.confirmButton.toggle();
  this.addButton.toggle();
  if(!this.dropdownWidget.getMenu().getItemFromLabel('WikiToLearn')){
    this.dropdownWidget.getMenu().addItems([new OO.ui.MenuOptionWidget( {
        data: newGloss,
        label: 'WikiToLearn',
    } )]);
  }else{
    this.dropdownWidget.getMenu().getItemFromLabel('WikiToLearn').setData(newGloss);
  }
  this.dropdownWidget.getMenu().selectItemByLabel('WikiToLearn');
  this.fieldLayout.toggle();
	this.getMoreButton.toggle();
};

ve.ui.easyLinkPage.prototype.onGetMoreButtonClick = function() {
	var page = this;
	$.getJSON(
		'/Special:EasyLink',
		{command: 'getMoreGlosses', babelnetId: page.babelnetId}
	).done(function(results){
		var items = [];
	  $.each(results, function(key, value){
			if(!page.dropdownWidget.getMenu().getItemFromLabel(value.glossSource)){
				items.push(new OO.ui.MenuOptionWidget( {
						data: value.gloss,
						label: value.glossSource,
				} ));
			}
	  });
		page.dropdownWidget.getMenu().addItems(items);
	}).fail(function( jqxhr, textStatus, error){
		var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
	})
};

ve.ui.easyLinkPage.prototype.createDropdown = function(config) {
  var items = [];
  $.each(this.attribute, function(key, value){
    items.push(new OO.ui.MenuOptionWidget( {
        data: value.gloss,
        label: value.glossSource,
    } ));
  });
  return new OO.ui.DropdownWidget({
    label: 'Seleziona una fonte',
    menu: {
      items: items
    }
  } );
};

/**
 * Create a inputext to be used by the edit dialog widget
 *
 * @param {Object} [config] Configuration options
 * @return {OO.ui.Widget} Text input widget
 */
ve.ui.easyLinkPage.prototype.createInputWidget = function ( config ) {
	return new OO.ui.TextInputWidget( $.extend( { validate: 'non-empty' }, config ) );
};

/**
 * Create a textarea to be used by the edit dialog widget
 *
 * @param {Object} [config] Configuration options
 * @return {OO.ui.Widget} Text input widget
 */
ve.ui.easyLinkPage.prototype.createTextareaWidget = function ( config ) {
	return new OO.ui.TextInputWidget( $.extend( { validate: 'non-empty', multiline: true, rows: 5 }, config ) );
};

/**
 * @inheritdoc
 */
ve.ui.easyLinkPage.prototype.setupOutlineItem = function ( outlineItem ) {
	ve.ui.easyLinkPage.super.prototype.setupOutlineItem.call( this, outlineItem );
	this.outlineItem.setLabel( this.label );
};
