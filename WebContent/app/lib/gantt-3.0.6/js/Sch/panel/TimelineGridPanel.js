/**

@class Sch.panel.TimelineGridPanel
@extends Ext.grid.Panel
@mixin Sch.mixin.TimelinePanel

Internal class. 

*/
Ext.define("Sch.panel.TimelineGridPanel", {
    extend  : "Ext.grid.Panel",
    mixins  : [
        'Sch.mixin.Localizable',
        'Sch.mixin.TimelinePanel'
    ],
    subGridXType            : 'gridpanel',

    initComponent : function() {
        this.callParent(arguments);
        this.getSchedulingView()._initializeTimelineView();
    }
}, function() {
    this.override(Sch.mixin.TimelinePanel.prototype.inheritables() || {});
});