Ext.define('Pricing.store.estimation.PricingTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Pricing.model.estimation.PricingTreeModel',
    autoSync: false,
    autoLoad:false,
    root: {
        id: 0,
        expanded: false,
        description:'Projects'
    },
    proxy: {
        type: 'ajax',
        writer: {
            writeAllFields: true,
            allowSingle: false,
            rootProperty: 'children',
            clientIdProperty: 'clientId'
        },
        reader: {
            type: 'json',
            rootProperty: 'children',
            successProperty: 'success'
        },
            api: {
            //api should be updated with project id
            create: 'rest/estimation/addtasks',
            read: 'rest/estimation/gettasks',
            update: 'rest/estimation/updatetasks',
            destroy: 'rest/estimation/deletetasks'
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    }
});