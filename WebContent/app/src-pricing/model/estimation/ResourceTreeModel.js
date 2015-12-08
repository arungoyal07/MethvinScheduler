Ext.define('Pricing.model.estimation.ResourceTreeModel', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'id',
    identifier: 'negative',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'description', type: 'string' },
        { name: 'rate', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'resUsage', type: 'number' },
        { name: 'amount', type: 'number' },
        { name: 'expanded', type: 'boolean' },
        { name: 'levelId', type: 'int' },
        { name: 'parentId', type: 'int' },
        { name: 'sequenceId', type: 'int' },
        { name: 'cls', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'isComplex', type: 'boolean' }
    ]
});