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

    // Parent constructor
    ve.ui.easyLinkAnnotationWidget.super.apply(this, arguments);

    // Events

    this.$element.addClass('ve-ui-easyLinkAnnotationWidget').append("prova");
};

/* Inheritance */

OO.inheritClass( ve.ui.easyLinkAnnotationWidget, OO.ui.Widget );

/* Events */

/* Methods */

/**
 * Get a text value for the current annotation
 *
 * @static
 * @param {ve.dm.easyLinkAnnotation|null} annotation easyLink annotation
 */
ve.ui.LinkAnnotationWidget.static.getTextFromAnnotation = function ( annotation ) {
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
 * Gets the annotation value.
 *
 * @method
 * @return {ve.dm.easyLinkAnnotation} easyLink annotation
 */
ve.ui.easyLinkAnnotationWidget.prototype.getAnnotation = function () {
    return this.annotation;
}; 