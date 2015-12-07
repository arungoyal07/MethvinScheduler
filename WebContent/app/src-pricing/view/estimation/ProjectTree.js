Ext.define('Pricing.view.estimation.ProjectTree', {
    extend: 'Ext.tree.Panel',
    border: false,
    alias: 'widget.methvinProjectTree',
    store: Ext.create('Pricing.store.estimation.ProjectTreeStore'),
    border: false,
    autoWidth: true,
    autoHeight: true,
    id: 'methvinProjectTree',
    rootVisible: true,
    controller:'projectTreeViewController',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            listeners: {
                edit: 'projectNameEdit'
            }
        })
    ],
    listeners:{
        itemcontextmenu: 'showProjectContextMenu',
        cellclick: 'projectTreeClick',
        itemexpand: 'projectNameEdit',//this is only synching the store
        itemcollapse: 'projectNameEdit'
    },
    dockedItems: [{
        dock: 'top',
        border: 0,
        items: [{
            layout: 'hbox',
            border: 0,
            items: [{
                html: 'Company',
                width: 70
            }, {
                html: 'Company Dropdown',
                flex: 1
            }]
        }]
    }],
    columns: [{
        xtype: 'treecolumn',
        flex: 1,
        dataIndex: 'description',
        allownumbers: false,
        sortable: true,
        editor: { xtype: 'textfield' },
    }]

});