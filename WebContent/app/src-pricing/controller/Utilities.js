Ext.define('Pricing.controller.Utilities', {
    singleton: true,
    globalVariableStore: null,
    projectId: null,

    setProjecProxies: function (projectId) {
        this.projectId = projectId;

        var pricingStore = Ext.getCmp('methvinPricingTree').getStore();
        var api = pricingStore.getProxy().getApi();
        api.create = 'rest/estimation/addtasks/' + projectId;
        api.read = 'rest/estimation/gettasks/' + projectId;
        api.update = 'rest/estimation/updatetasks/' + projectId;
        api.destroy = 'rest/estimation/deletetasks/' + projectId;
        pricingStore.projectId = projectId;

        var globalVariableStoreApi = this.globalVariableStore.getProxy().getApi();
        globalVariableStoreApi.create = 'rest/estimation/addglobalvariables/' + projectId;
        globalVariableStoreApi.read = 'rest/estimation/getglobalvariables/' + projectId;
        globalVariableStoreApi.update = 'rest/estimation/updateglobalvariables/' + projectId;
        globalVariableStoreApi.destroy = 'rest/estimation/deleteglobalvariables/' + projectId;
    },

    setPricingFormulaStore: function (formulaStore, projectId, record) {
        var api = formulaStore.getProxy().getApi();
        var taskId = record.getId();
        var linkedTaskId = record.get('linkedTaskId');
        if (linkedTaskId == 0) {
            linkedTaskId = taskId;
        }
        api.create = 'rest/estimation/addpricingformulae/' + projectId + '/' + linkedTaskId;
        api.read = 'rest/estimation/getpricingformulae/' + projectId + '/' + linkedTaskId;
        api.update = 'rest/estimation/updatepricingformulae/' + projectId + '/' + linkedTaskId;
        api.destroy = 'rest/estimation/deletepricingformulae/' + projectId + '/' + linkedTaskId;
        formulaStore.projectId = projectId;
        formulaStore.linkedTaskId = linkedTaskId;
        formulaStore.taskId = taskId;
        formulaStore.quantity = record.get('quantity');
    },

    setLinkedTaskProxy: function (proxy, projectId, taskId) {
        proxy.url = 'rest/estimation/getlinkedtasks/' + projectId + '/' + taskId;
    }


});