Ext.define('Pricing.store.estimation.ProjectTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Pricing.model.estimation.ProjectTreeModel',
    autoSync: false,
    autoLoad: true,
    root: {
        id: 0,
        expanded: false,
        description: 'Projects'
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
            create: 'rest/estimation/addprojects/1',
            read: 'rest/estimation/getprojects/1',
            update: 'rest/estimation/updateprojects/1',
            destroy: 'rest/estimation/deleteprojects/1'
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    }
});