Ext.define("methwin.client.view.Gantt", {
    extend: 'Gnt.panel.Gantt',
    alias: 'widget.gantt',

    // Ext JS configs
    requires: [
               'methwin.client.store.TaskStore'
    ],

    requires: [
        'Ext.tree.plugin.TreeViewDragDrop',
        'Ext.form.field.Text',
        'Sch.plugin.TreeCellEditing',
        'Sch.plugin.Pan',
        'Gnt.plugin.TaskEditor',
        'Gnt.plugin.ProjectEditor',
        'Gnt.column.Sequence',
        'Gnt.column.Name',
        'Gnt.column.StartDate',
        'Gnt.column.EndDate',
        'Gnt.column.Duration',
        'Gnt.column.ConstraintType',
        'Gnt.column.ConstraintDate',
        'Gnt.column.PercentDone',
        'Gnt.column.Predecessor',
        'Gnt.column.ManuallyScheduled',
        'Gnt.column.AddNew',
        'Gnt.widget.calendar.ResourceCalendarGrid',
        'methwin.client.column.ShowInTimeline',
        'methwin.client.plugin.TaskArea',
        'methwin.client.plugin.TaskContextMenu'
    ],
    selModel: {
        mode: 'MULTI'
    },

    flex: 1,
    lockedGridConfig: {
        width: 600,
        bind: {
            selection: '{selectedTasks}'
        }
    },

    // Define properties for the left 'locked' and scrollable tree view
    lockedViewConfig: {
        // Adds a CSS class returned to each row element
        getRowClass: function (rec) {
            return rec.isRoot() ? 'root-row' : (rec.getCls()?rec.getCls():'');
        },

        // Enable node reordering in the locked grid
        plugins: {
            ptype: 'treeviewdragdrop',
            containerScroll: true
        }
    },

    loadMask: true,

    // Gantt configs
    leftLabelField: 'Name',
    highlightWeekends: true,
    viewPreset: 'weekAndDayLetter',
    columnLines: true,
    cascadeChanges: true,

    tipCfg: { cls: 'tasktip' },

    // Define an HTML template for the tooltip
    tooltipTpl: new Ext.XTemplate(
        '<table>',
        '<tr><th class="caption" colspan="2">#{Id} {Name}</th></tr>',
        '<tr>',
        '<th>Start:</th><td>{[values._record.getDisplayStartDate("y-m-d")]}</td>',
        '</tr>',
        '<tr>',
        '<th>End:</th><td>{[values._record.getDisplayEndDate("y-m-d")]}</td>',
        '</tr>',
        '<tr>',
        '<th>Progress:</th><td>{[Math.round(values.PercentDone)]}%</td>',
        '</tr>',
        '</table>'
    ),

    initComponent: function () {
        var me = this;

        //Ext.apply(this, {
        //    tbar: {
        //        xtype: 'gantttoolbar',
        //        gantt: this
        //    }
        //});

        this.callParent(arguments);
    },

    viewConfig: {
        getRowClass: function (record) {
            // Output a custom CSS class with some task property that we can use for styling
            return 'TASKID_' + record.data.Id;
        },
        stripeRows : true
    },

    columns: [
        {
            xtype: 'wbscolumn',
            tdCls: 'id',
           width:50	
        },
        {
            xtype: 'namecolumn',
            tdCls: 'namecell',
            width: 200
        },
     
        
        {
            xtype: 'startdatecolumn',
            width:70
        },
        {
            xtype: 'durationcolumn',
            width:60
        },
        {
            xtype: 'enddatecolumn',
            width:70
        },
      
        {
            xtype: 'effortcolumn',
            width:50,
            useAbbreviation:true
        },
       
        {
            header: 'Assigned Resources',
            width: 120,
            tdCls: 'resourcecell',
            xtype: 'resourceassignmentcolumn'
        },
        {
            xtype: 'percentdonecolumn'
        },
      
        {
            xtype: 'addnewcolumn'
        }
    ],
    
    plugins: [
              'advanced_taskcontextmenu',
               // 'scheduler_pan',
                 'gantt_taskeditor',
               //  'gantt_projecteditor',
               //{
               //    pluginId: 'taskarea',
               //    ptype: 'taskarea'
               //},
               {
                   ptype: 'scheduler_treecellediting',
                   clicksToEdit: 2,
                   pluginId: 'editingInterface'
               }
             ]

    //plugins: [
    //    'gantt_taskeditor',
    //    'scheduler_treecellediting',
    //    'gantt_taskcontextmenu'
    //]
});
