Ext.define('Pricing.view.estimation.ResourceTree', {
    extend: 'Ext.tree.Panel',
    border: false,
    alias: 'widget.methvinResourceTree',
    store: Ext.create('Pricing.store.estimation.ResourceTreeStore'),
    border: false,
    id: 'methvinResourceTree',
    rootVisible: false,
    multiSelect: true,
    autoScroll: true,
    columns: [{
        xtype: 'treecolumn',
        text: 'Item',
        width: 200,
        dataIndex: 'description',
        allownumbers: false,
        sortable: true,
        editor: { xtype: 'textfield' }
    }]
});