/**
 *
 * @class
 * @extends ve.ui.AnnotationInspector
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
ve.ui.easyLinkAnnotationInspector = function ( config ) {
    // Parent constructor
    ve.ui.AnnotationInspector.call( this, config );
};

/* Inheritance */

OO.inheritClass( ve.ui.easyLinkAnnotationInspector, ve.ui.AnnotationInspector );

/* Static properties */

ve.ui.easyLinkAnnotationInspector.static.name = 'link/easyLink';
ve.ui.easyLinkAnnotationInspector.static.title = OO.ui.deferMsg( 'easylink-ve-toolname' );
ve.ui.easyLinkAnnotationInspector.static.modelClasses = [ ve.dm.easyLinkAnnotation ];

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.easyLinkAnnotationInspector.prototype.initialize = function () {
    // Parent method
    ve.ui.easyLinkAnnotationInspector.super.prototype.initialize.call( this );

    // Properties
    this.annotationWidget = this.createAnnotationWidget(this.model);
    this.annotationWidget.input.setValue("Qui dovrebbe esserci la definizione");

    // Initialization
    this.form.$element.append( this.annotationWidget.$element );
};

/**
 * Create an easyLink annotation widget
 *
 * @return {ve.ui.easyLinkAnnotationWidget} Link annotation widget
 */
ve.ui.easyLinkAnnotationInspector.prototype.createAnnotationWidget = function (model) {
    return new ve.ui.easyLinkAnnotationWidget(model);
};

/**
 * @inheritdoc
 */
ve.ui.LinkAnnotationInspector.prototype.shouldRemoveAnnotation = function () {
    return !this.annotationWidget.getAnnotation();
};

/**
 * @inheritdoc
 */
ve.ui.LinkAnnotationInspector.prototype.getSetupProcess = function ( data ) {
    return ve.ui.easyLinkAnnotationInspector.super.prototype.getSetupProcess.call( this, data )
        .next( function () {
            this.annotationWidget.setAnnotation( this.initialAnnotation );
        }, this );
};

/**
 * @inheritdoc
 */
ve.ui.easyLinkAnnotationInspector.prototype.getAnnotation = function () {
    return this.annotationWidget.getAnnotation();
};

/**
 * @inheritdoc
 */
ve.ui.easyLinkAnnotationInspector.prototype.getTeardownProcess = function ( data ) {
    return ve.ui.easyLinkAnnotationInspector.super.prototype.getTeardownProcess.call( this, data )
        .next( function () {
            this.annotationWidget.setAnnotation( null );
        }, this );
};

/* Registration */

ve.ui.windowFactory.register( ve.ui.easyLinkAnnotationInspector );
