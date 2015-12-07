Ext.define('Pricing.store.estimation.GlobalVariablesStore', {
    extend: 'Ext.data.Store',
    model: 'Pricing.model.estimation.GlobalVariablesModel',
    proxy: {
        type: 'ajax',
        api:{
            //to be set dynamically
        },
        reader: {
            type: 'json',
            rootProperty:'children'
        },
        writer: {
            writeAllFields: true,
            allowSingle: false,
            rootProperty: 'children',
            clientIdProperty: 'clientId'
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    },
    autoLoad: false
});