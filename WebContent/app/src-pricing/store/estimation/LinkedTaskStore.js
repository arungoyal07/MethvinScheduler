Ext.define('Pricing.store.estimation.LinkedTaskStore', {
    extend: 'Ext.data.Store',
    model: 'Pricing.model.estimation.PricingFormulaGridModel',
    proxy: {
        type: 'ajax',
        //url will be updated dynamically based on project & linked task
        url: 'rest/estimation/getlinkedtasks/',
        reader: {
            type: 'json',
            rootProperty:'children'
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    },
    autoLoad: false
});