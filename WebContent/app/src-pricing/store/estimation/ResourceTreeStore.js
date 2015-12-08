Ext.define('Pricing.store.estimation.ResourceTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Pricing.model.estimation.ResourceTreeModel',
    autoSync: false,
    autoLoad: false,
    root: {
        id: 0,
        expanded: false,
        description: 'Resources'
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
            create: 'rest/estimation/addresources/1',
            read: 'rest/estimation/getresources/1',
            update: 'rest/estimation/updateresources/1',
            destroy: 'rest/estimation/deleteresources/1'
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    }
    //my changes in this file. Github learning
});