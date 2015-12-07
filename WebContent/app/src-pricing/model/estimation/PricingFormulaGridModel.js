Ext.define('Pricing.model.estimation.PricingFormulaGridModel', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'taskId', type: 'int' },
        { name: 'projectId ', type: 'int' },
        { name: 'resourceId', type: 'int' },
        { name: 'resourceRate', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'variable', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'equation', type: 'string' },
        { name: 'value', type: 'number' },
        { name: 'rate', type: 'number' },
        { name: 'expanded', type: 'boolean' },
        { name: 'parentId', type: 'int' },
        { name: 'sequenceId', type: 'int' },
        { name: 'cls', type: 'string' },
        { name: 'color', type: 'string' }
    ]
});