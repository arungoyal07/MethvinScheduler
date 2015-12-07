Ext.define('Pricing.model.estimation.ProjectTreeModel', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'id',
    identifier: 'negative',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'description', type: 'string' },
        { name: 'type', type: 'int' },//0 lable , 1 project , 2 proposal
        { name: 'vendorId', type: 'int' },
        { name: 'markup', type: 'number' },
        { name: 'parentId', type: 'int' },
        { name: 'createdBy', type: 'int' },
        { name: 'companyId', type: 'int' },
        { name: 'tenderId', type: 'int' },
        { name: 'referedTenderId', tye: 'int' },
        { name: 'isPublished', tye: 'boolean' },
        { name: 'expanded', type: 'boolean' }
    ]
});