/**

@class Gnt.column.BaselineStartDate
@extends Ext.grid.column.Date

A Column displaying the baseline start date of a task.

    var gantt = Ext.create('Gnt.panel.Gantt', {
        height      : 600,
        width       : 1000,

        columns         : [
            ...
            {
                xtype       : 'baselinestartdatecolumn',
                width       : 80
            }
            ...
        ],
        ...
    })

Note, that this class inherit from [Ext.grid.column.Date](http://docs.sencha.com/ext-js/4-2/#!/api/Ext.grid.column.Date) and supports its configuration options, notably the "format" option.
*/
Ext.define('Gnt.column.BaselineStartDate', {
    extend              : 'Gnt.column.StartDate',

    requires            : ['Gnt.field.BaselineStartDate'],

    alias               : [
        'widget.baselinestartdatecolumn',
        'widget.ganttcolumn.baselinestartdate'
    ],

    width               : 100,

    fieldProperty       : 'baselineStartDateField',

    fieldConfigs        : [ 'instantUpdate', 'adjustMilestones' ],

    defaultEditorXType  : 'baselinestartdatefield'
});
