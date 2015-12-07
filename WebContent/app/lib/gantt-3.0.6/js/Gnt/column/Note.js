/**
@class Gnt.column.Note
@extends Ext.grid.column.Column

A Column showing the `Note` field of the task.

    var gantt = Ext.create('Gnt.panel.Gantt', {
        height      : 600,
        width       : 1000,

        columns         : [
            ...
            {
                xtype       : 'notecolumn',
                width       : 80
            }
            ...
        ],

        plugins             : [
            Ext.create('Sch.plugin.TreeCellEditing', {
                clicksToEdit: 1
            })
        ],
        ...
    })

*/
Ext.define("Gnt.column.Note", {
    extend              : "Ext.grid.column.Column",

    requires            : ['Gnt.field.Note'],

    mixins              : ['Gnt.column.mixin.TaskFieldColumn'],

    alias               : [
        "widget.notecolumn",
        "widget.ganttcolumn.note"
    ],

    defaultEditorXType  : 'notefield',

    fieldProperty       : 'noteField',

    previewFn           : null,
    previewFnScope      : null,

    fieldConfigs        : [ 'instantUpdate', 'previewFn', 'previewFnScope' ],

    initComponent : function () {
        this.initTaskFieldColumn();
        this.callParent(arguments);
    }

});
