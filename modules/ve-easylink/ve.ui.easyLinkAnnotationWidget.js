/*!
 * VisualEditor UserInterface LanguageInputWidget class.
 *
 * @copyright 2011-2016 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * Creates an ve.ui.LanguageInputWidget object.
 *
 * @class
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [requireDir] Require directionality to be set (no 'auto' value)
 * @cfg {boolean} [hideCodeInput] Prevent user from entering a language code as free text
 * @cfg {ve.ui.WindowManager} [dialogManager] Window manager to launch the language search dialog in
 * @cfg {string[]} [availableLanguages] Available language codes to show in search dialog
 */
ve.ui.easyLinkAnnotationWidget = function (config) {

    // Properties
    this.annotation = null;
	  this.input = this.createInputWidget( config );

    // Parent constructor
    ve.ui.easyLinkAnnotationWidget.super.apply(this, arguments);

    // Initialization
    this.$element.addClass('ve-ui-easyLinkAnnotationWidget').append( this.input.$element );

    // Events
	  //this.getTextInputWidget().connect( this, { change: 'onTextChange' } );
};

/* Inheritance */

OO.inheritClass( ve.ui.easyLinkAnnotationWidget, OO.ui.Widget );

/* Methods */

/**
 * Handle value-changing events from the text input
 *
 * @method
 */
ve.ui.easyLinkAnnotationWidget.prototype.onTextChange = function ( value ) {
	var isExt,
		widget = this;

	// RTL/LTR check
	// TODO: Make this work properly
	if ( $( 'body' ).hasClass( 'rtl' ) ) {
		isExt = ve.init.platform.getExternalLinkUrlProtocolsRegExp().test( value.trim() );
		// If URL is external, flip to LTR. Otherwise, set back to RTL
		this.getTextInputWidget().setRTL( !isExt );
	}

	this.getTextInputWidget().isValid().done( function ( valid ) {
		// Keep annotation in sync with value
		widget.setAnnotation( valid ? widget.constructor.static.getAnnotationFromText( value ) : null, true );
	} );
};

/**
 * Get a text value for the current annotation
 *
 * @static
 * @param {ve.dm.easyLinkAnnotation|null} annotation easyLink annotation
 */
ve.ui.easyLinkAnnotationWidget.static.getTextFromAnnotation = function ( annotation ) {
    return annotation ? annotation.getComparableObject() : '';
};

ve.ui.easyLinkAnnotationWidget.prototype.setAnnotation = function (annotation){
    if ( ve.compare(
            annotation ? annotation.getComparableObject() : {},
            this.annotation ? this.annotation.getComparableObject() : {}
    ) ) {
        // No change
        return this;
    }

    this.annotation = annotation;
};

/**
 * Create a widget to be used by the annotation widget
 *
 * @param {Object} [config] Configuration options
 * @return {OO.ui.Widget} Text input widget
 */
ve.ui.easyLinkAnnotationWidget.prototype.createInputWidget = function ( config ) {
	return new OO.ui.TextInputWidget( $.extend( { validate: 'non-empty' }, config ) );
};

/**
 * Get the text input widget used by the annotation widget
 *
 * @return {OO.ui.TextInputWidget} Text input widget
 */
ve.ui.easyLinkAnnotationWidget.prototype.getTextInputWidget = function () {
	return this.input;
};

/**
 * Gets the annotation value.
 *
 * @method
 * @return {ve.dm.easyLinkAnnotation} easyLink annotation
 */
ve.ui.easyLinkAnnotationWidget.prototype.getAnnotation = function () {
    return this.annotation;
};
