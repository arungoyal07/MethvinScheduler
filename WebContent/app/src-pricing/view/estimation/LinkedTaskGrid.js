Ext.define('Pricing.view.estimation.LinkedTaskGrid', {
    extend: 'Ext.grid.Panel',
    id: 'methvinLinkedTaskGrid',
    alias: 'widget.methvinLinkedTaskGrid',
    store: Ext.create('Pricing.store.estimation.LinkedTaskStore'),
    border: 0,
    columns: [
        { dataIndex: 'description' }
    ]
});