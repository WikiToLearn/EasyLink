/**
 *
 * @class
 * @extends ve.ui.AnnotationContextItem
 *
 * @param {ve.ui.Context} context Context item is in
 * @param {ve.dm.Model} model Model item is related to
 * @param {Object} config Configuration options
 */
ve.ui.easyLinkContextItem = function ( context, model, config ) {
    // Parent constructor
    ve.ui.easyLinkContextItem.super.call(this, context, model, config );

    // Initialization
    this.$element.addClass( 've-ui-easyLinkContextItem' );

    this.actionButtons.clearItems();

    if ( !this.context.isMobile() ) {
        this.clearButton = new OO.ui.ButtonWidget( {
            label: 'Remove',
            icon: 'remove',
            iconTitle: 'Remove',
            flags: [ 'destructive' ]
        } );
        this.confirmButton = new OO.ui.ButtonWidget({
            label: 'Ok',
            icon: 'check',
            iconTitle: 'Ok',
            flags: ['constructive']
        });
    } else {
        this.clearButton = new OO.ui.ButtonWidget( {
            framed: false,
            icon: 'remove',
            flags: [ 'destructive' ]
        } );
    }
    if ( this.isClearable() ) {
        this.actionButtons.addItems( [ this.clearButton ], 0 );
        this.actionButtons.addItems([this.confirmButton], 1);
    }
    this.clearButton.connect( this, { click: 'onClearButtonClick' } );
    this.confirmButton.connect(this, {click: 'onConfirmButtonClick'});
};

/* Inheritance */

OO.inheritClass( ve.ui.easyLinkContextItem, ve.ui.LinearContextItem );

/* Static Properties */

ve.ui.easyLinkContextItem.static.name = 'easyLink';

ve.ui.easyLinkContextItem.static.icon = 'tag';

ve.ui.easyLinkContextItem.static.label = OO.ui.deferMsg( 'easylink-ve-toolname' );

ve.ui.easyLinkContextItem.static.modelClasses = [ ve.dm.easyLinkAnnotation ];

ve.ui.easyLinkContextItem.static.embeddable = false;

ve.ui.easyLinkContextItem.static.commandName = 'link/easyLink';

ve.ui.easyLinkContextItem.static.clearable = true;

/* Methods */

ve.ui.easyLinkContextItem.prototype.renderBody=  function(){
    this.$body.html(this.getDescription());
};

/**
 * Check if item is clearable.
 *
 * @return {boolean} Item is clearable
 */
ve.ui.easyLinkContextItem.prototype.isClearable = function () {
    return this.constructor.static.clearable;
};

/**
 * Handle clear button click events.
 *
 * @localdoc Removes any modelClasses annotations from the current fragment
 *
 * @protected
 */
ve.ui.easyLinkContextItem.prototype.onClearButtonClick = function () {
    this.applyToAnnotations( function ( fragment, annotation ) {
        fragment.annotateContent( 'clear', annotation );
    } );
};

///HACK!!!! I have to find out a better solution!!
ve.ui.easyLinkContextItem.prototype.onConfirmButtonClick = function () {
    this.context.popup.toggle();
};

/**
 * @inheritdoc
 */
ve.ui.easyLinkContextItem.prototype.getDescription = function () {
    var descriptionObj = ve.ce.easyLinkAnnotation.static.getDescription( this.model );
    var description = "<p><strong>" + descriptionObj.title.toUpperCase() 
                        + ":</strong></p><p>" + descriptionObj.gloss + "</p><p>" 
                        + OO.ui.msg( 'easylink-ve-dialog-gloss-source' ) 
                        + descriptionObj.glossSource + "</p>";
    return description;
};

/**
 * Apply a callback to every modelClass annotation in the current fragment
 *
 * @param  {Function} callback Callback, will be passed fragment and annotation
 */
ve.ui.easyLinkContextItem.prototype.applyToAnnotations = function ( callback ) {
    var i, len,
        modelClasses = this.constructor.static.modelClasses,
        fragment = this.getFragment(),
        annotations = fragment.getAnnotations( true ).filter( function ( annotation ) {
            return ve.isInstanceOfAny( annotation, modelClasses );
        } ).get();
    if (
        !annotations.length &&
        fragment.getSelection().isCollapsed() &&
        fragment.getDocument().data.isContentOffset( fragment.getSelection().getRange().start )
    ) {
        // Expand to nearest word and try again
        fragment = fragment.expandLinearSelection( 'word' );

        annotations = fragment.getAnnotations( true ).filter( function ( annotation ) {
            return ve.isInstanceOfAny( annotation, modelClasses );
        } ).get();
    }
    for ( i = 0, len = annotations.length; i < len; i++ ) {
        callback( fragment.expandLinearSelection( 'annotation', annotations[ i ] ), annotations[ i ] );
    }
};

/* Registration */

ve.ui.contextItemFactory.register( ve.ui.easyLinkContextItem );