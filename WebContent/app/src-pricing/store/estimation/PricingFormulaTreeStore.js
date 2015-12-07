Ext.define('Pricing.store.estimation.PricingFormulaTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Pricing.model.estimation.PricingFormulaTreeModel',
    autoSync: false,
    autoLoad:false,
    root: {
        id: 0,
        expanded: false
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
        //though api is dynamically assigned in the utilities on task double click
        api: {
            create: 'rest/estimation/addpricingformulae',
            read: 'rest/estimation/getpricingformulae',
            update: 'rest/estimation/updatepricingformulae',
            destroy:'rest/estimation/deletepricingformulae'
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    }
});