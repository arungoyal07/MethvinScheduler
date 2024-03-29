/**

@class Gnt.column.Predecessor
@extends Gnt.column.Dependency

A Column showing the predecessors of a task. The column is editable when adding a
`Sch.plugin.TreeCellEditing` plugin to your gantt panel. The overall setup will look like this:

    var gantt = Ext.create('Gnt.panel.Gantt', {
        height      : 600,
        width       : 1000,

        // Setup your grid columns
        columns         : [
            ...
            {
                xtype       : 'predecessorcolumn',
                width       : 70
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

This column uses a specialized field - {@link Gnt.field.Dependency} which allows the
user to specify multiple predecessor including lag. Please refer to {@link Gnt.field.Dependency}
documentation for expected value format.

*/
Ext.define("Gnt.column.Predecessor", {
    extend      : "Gnt.column.Dependency",

    mixins      : ['Gnt.mixin.Localizable'],

    alias       : [
        "widget.predecessorcolumn",
        "widget.ganttcolumn.predecessor"
    ],

    /**
     * @cfg {Object} l10n
     * A object, purposed for the class localization. Contains the following keys/values:

            - text : 'Predecessors'
     */

    type        : 'predecessors',

    constructor : function (config) {
        config = config || {};        

        this.text   = config.text || this.L('text');

        this.callParent(arguments);
    }
});
