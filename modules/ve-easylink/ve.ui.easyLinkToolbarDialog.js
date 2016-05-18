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

/* Methods */

/**
* @inheritdoc
*/
ve.ui.easyLinkToolbarDialog.prototype.initialize = function () {
// Parent method
ve.ui.easyLinkToolbarDialog.super.prototype.initialize.call( this );
this.capsule = new OO.ui.FieldLayout( new OO.ui.CapsuleMultiSelectWidget( {
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
this.$element.append( this.capsule.$element );
};

/* Registration */

ve.ui.windowFactory.register( ve.ui.easyLinkToolbarDialog );