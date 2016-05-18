/**
 * UserInterface language tool.
 *
 * @class
 * @extends ve.ui.FragmentInspectorTool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
ve.ui.easyLinkInspectorTool = function () {
    ve.ui.easyLinkInspectorTool.super.apply( this, arguments );
};
OO.inheritClass( ve.ui.easyLinkInspectorTool, ve.ui.FragmentInspectorTool );
ve.ui.easyLinkInspectorTool.static.name = 'link/easyLink';
ve.ui.easyLinkInspectorTool.static.group = 'link';
ve.ui.easyLinkInspectorTool.static.icon = 'link';
ve.ui.easyLinkInspectorTool.static.title = OO.ui.deferMsg( 'easylink-ve-toolname' );
ve.ui.easyLinkInspectorTool.static.modelClasses = [ ve.dm.easyLinkAnnotation ];
ve.ui.easyLinkInspectorTool.static.commandName = 'link/easyLink';
ve.ui.toolFactory.register( ve.ui.easyLinkInspectorTool )