/**

@class Gnt.column.Name
@extends Ext.tree.Column

A Column representing the `Name` field of a task. The column is editable, however to enable the editing you will need to add a
`Sch.plugin.TreeCellEditing` plugin to your gantt panel. The overall setup will look like this:

    var gantt = Ext.create('Gnt.panel.Gantt', {
        height      : 600,
        width       : 1000,

        // Setup your grid columns
        columns         : [
            ...
            {
                xtype       : 'namecolumn',
                width       : 200
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
Ext.define('Gnt.column.Name', {
    extend              : 'Ext.tree.Column',

    alias               : [
        'widget.namecolumn',
        'widget.ganttcolumn.name'
    ],

    mixins              : ['Gnt.column.mixin.TaskFieldColumn'],

    /**
     * @cfg {Object} l10n
     * A object, purposed for the class localization. Contains the following keys/values:

        - text : 'Task Name'
     */

    // Ext 5.1.0 sets this to false
    draggable           : true,

    fieldProperty       : 'nameField',

    defaultEditorXType  : 'textfield',

    initComponent : function () {
        this.initTaskFieldColumn({
            allowBlank  : false
        });

        this.callParent(arguments);
    },


    applyColumnCls : function (value, meta, task) {
        if (task && task.isProject) {
            meta.tdCls = (meta.tdCls || '') + ' sch-gantt-project-name';
        }
    },


    getValueToRender : function (value) {
        return value;
    }

});
