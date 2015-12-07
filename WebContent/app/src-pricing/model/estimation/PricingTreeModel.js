Ext.define('Pricing.model.estimation.PricingTreeModel', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'id',
    identifier: 'negative',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'parentId', type: 'int' },
        { name: 'item', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'costRate', type: 'number' },
        { name: 'costAmount', type: 'number' },
        { name: 'grossRate', type: 'number' },
        { name: 'grossAmount', type: 'number' },
        { name: 'markup', type: 'number' },
        { name: 'isLocked', type: 'boolean' },
        { name: 'isSubScheduler', type: 'boolean' },
        { name: 'expanded', type: 'boolean' },
        { name: 'vendorId', type: 'int' },
        { name: 'noteId', type: 'int' },
        { name: 'tagId', type: 'int' },
        { name: 'linkedTaskId', type: 'int' },
        { name: 'cls', type: 'string' },

    ]
});