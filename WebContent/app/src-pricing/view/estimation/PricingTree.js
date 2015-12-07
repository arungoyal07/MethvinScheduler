Ext.define('Pricing.view.estimation.PricingTree', {
    extend: 'Ext.tree.Panel',
    border: false,
    alias: 'widget.methvinPricingTree',
    store: Ext.create('Pricing.store.estimation.PricingTreeStore'),
    border: false,
    id: 'methvinPricingTree',
    rootVisible: false,
    multiSelect: true,
    autoScroll: true,
    controller: 'pricingTreeViewController',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            id: 'taskCellEditing',
            listeners: {
                'edit': 'editPricing',
                'beforeedit': 'beforeedit'
            }
        })
    ],
    viewConfig: {
        getRowClass: function (record, rowIndex, rowParams, store) {
            return record.get('isSubScheduler')?record.get('cls')+' cls-ss':record.get('cls');
        }
    },

    listeners: {
        celldblclick: 'onCellDblClick',
        itemexpand: 'itemexpand',
        itemcollapse: 'itemcollapse'
    },
    columns: [{
        xtype: 'treecolumn',
        text: 'Item',
        width: 200,
        dataIndex: 'item',
        allownumbers: false,
        sortable: true,
        editor: { xtype: 'textfield' },
    }, {
        text: 'Description',
        flex: 5.5,
        cls: 'tree-grid',
        sortable: true,
        dataIndex: 'description',
        editor: {
            xtype: 'textfield',
            grow: true,
        }
    }, {
        text: 'Quantity',
        flex: 1.8,
        sortable: true,
        dataIndex: 'quantity',
        align: 'right',
        editor: {
            xtype: 'textfield',
            maskRe: /[0-9.]/,
        }

    }, {
        text: 'Unit',
        flex: 1.3,
        sortable: true,
        dataIndex: 'unit',
        align: 'right',
        editor: {
            xtype: 'textfield'
        }
    }, {
        text: 'Cost Rate',
        flex: 2.1,
        sortable: true,
        dataIndex: 'costRate',
        align: 'right'
    }, {
        text: 'Cost Amount',
        flex: 2.4,
        sortable: true,
        dataIndex: 'costAmount',
        align: 'right'
    }, {
        text: 'Gross Rate',
        flex: 2.2,
        sortable: true,
        dataIndex: 'grossRate',
        align: 'right',
        editor: {
            xtype: 'textfield',
            maskRe: /[0-9.]/
        }
    }, {
        text: 'Gross Amount',
        flex: 2.5,
        sortable: true,
        dataIndex: 'grossAmount',
        align: 'right'
    }, {
        text: '%',
        flex: 1,
        sortable: true,
        align: 'right',
        xtype: 'numbercolumn',
        format: '0.00',
        dataIndex: 'markup',
        editor: {
            xtype: 'textfield',
            maskRe: /[0-9.]/
        }

    }, {
        xtype: 'checkcolumn',
        cls: 'collockFlag',
        flex: 1,
        dataIndex: 'isLocked',
        stopSelection: false
    },
     {
         xtype: 'actioncolumn',
         cls: 'colnotesFlag',
         flex: 2,
         align: 'center',
         items: [{
             getClass: function (v, meta, rec) {
                 if (rec.get('noteId') > 0) {
                     return 'icon-notesred';
                 } else {
                     return 'icon-notesblack';
                 }
             },
             tooltip: 'Add Notes',
             handler: 'addNotes'
         },
         {
             getClass: function (v, meta, rec) {
                 if (rec.get('tagId') > 0) {
                     return 'icon-tagsred';
                 } else {
                     return 'icon-tagsblack';
                 }
             },
             tooltip: 'Add Tags',
             handler: 'addTags'
         },
         {
             getClass: function (v, meta, rec) {
                 if (rec.get('linkedTaskId') > 0) {
                     return 'icon-pwred';
                 } else {
                     return 'icon-pwblack';
                 }
             },
             tooltip: 'Add Pricing Worksheet',
             handler: 'addNotes'
         }]
     }

    ],
    tbar: [{
        margin: '0 0 0 0',
        id: 'add',
        tooltip: 'Add item',
        handler: 'addPricingTask',
        xtype: 'button',
        align: 'right',
        text: 'Add',
        handler: 'addPricingTask'
    },
    {
        tooltip: 'Delete item',
        margin: '0 0 0 10',
        xtype: 'button',
        align: 'right',
        text: 'Delete',
        handler: 'deletePricingTask'
    },
    {
        tooltip: 'Outdent',
        xtype: 'button',
        align: 'right',
        margin: '0 0 0 10',
        text: 'Outdent',
        handler: 'outdentPricingTask'
    },
     {
         tooltip: 'Indent',
         xtype: 'button',
         align: 'right',
         margin: '0 0 0 10',
         text: 'Indent',
         handler: 'indentPricingTask'
     },
    {
        margin: '0 0 0 10',
        xtype: 'button',
        align: 'right',
        text: 'Add Pricing Worksheet',
        tooltip: 'Add pricing worksheet',
        handler: 'addPricingWorksheet'
    },

    {
        xtype: 'tbseparator',
        margin: '0 0 0 10'
    },
    {
        tooltip: 'Link selected items to a single pricing worksheet',
        margin: '0 0 0 10',
        xtype: 'button',
        align: 'right',
        text: 'Link selected Items',
        handler: 'linkSelectedTasks'
    },
    {
        xtype: 'splitbutton',
        margin: '0 0 0 10',
        text:'Format',
        tooltip: 'Format',
        iconCls: 'Format',
        id: 'IdFormat',
        menu: new Ext.menu.Menu({
            items: [
            {
                xtype: 'button',
                text: 'Reset',
                handler: 'resetStyles'
            },
            {
                xtype: 'button',
                text: 'Bold',
                handler: 'applyBoldStyles'
            },
             {
                 xtype: 'button',
                 text: '<i>Italic</i>',
                 handler: 'applyItalicStyles'

             },
             {
                 xtype: 'button',
                 text: '<u>Underline</u>',
                 handler:'applyUnderlineStyles'
             },
             {
                 xtype: 'button',
                 text: 'Strike through',
                 handler: 'applyStrikeThroughStyles'

             },
             {
                 xtype: 'button',
                 text: 'Text color',
                 menu: {
                     xtype: 'colormenu',
                     handler:'setColors',
                     listeners: {
                         select: function (picker, color) {
                             picker.clear();
                         }
                     }
                 },
             }
            ]
        })
    },
    {
        tooltip: 'Recalculate project',
        margin: '0 0 0 10',
        xtype: 'button',
        align: 'right',
        text: 'Recalculate project',
        handler: 'recalculateProject',
        id: 'reclaculate'
    }, {
        tooltip: 'Import from Excel',
        margin: '0 0 0 10',
        xtype: 'button',
        align: 'right',
        text: 'Import from Excel',
        handler: 'importfromExcel'
    },
     {
         tooltip: 'Create a Sub-schedule',
         margin: '0 0 0 10',
         xtype: 'button',
         align: 'right',
         text: 'Create a Sub-schedule',
         handler: 'createSubschedule'
     }

    ]
});