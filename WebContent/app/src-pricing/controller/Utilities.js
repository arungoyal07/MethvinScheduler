Ext.define('Pricing.controller.Utilities', {
    singleton: true,
    globalVariableStore: null,
    projectId: null,
    pricingFormulaResourceStore: null,

    pricingFormulaComboStore: Ext.create('Ext.data.Store', {
        fields: [
            {
                name: 'id',
                type: 'int'
            },
            {
                name: 'description',
                type: 'string'
            }, {
                name: 'isComplex',
                type: 'boolean'
            }
        ],
        data: []
    }),

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

    setPricingFormulaStore: function (projectId, record) {

        var formulaStore = Ext.getCmp('methvinPricingFormulaTree').getStore();
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

        formulaStore.load({
            callback: function () {
                var formulaStore = Ext.getCmp('methvinPricingFormulaTree').getStore();
                formulaStore.allDataLoaded = true;
                formulaStore.allDataLoadHandler();
                formulaStore.getRootNode().expand();
            }
        });
    },

    setLinkedTaskProxy: function (projectId, taskNode) {
        //load linked tasks
        var linkedGrid = Ext.getCmp('methvinLinkedTaskGrid');
        var linkedStore = linkedGrid.getStore();
        linkedStore.clearData();
        Ext.getCmp('methvinLinkedTaskGridContainer').hide();

        linkedStore.getProxy().url = 'rest/estimation/getlinkedtasks/' + projectId + '/' + taskNode.getId();

        linkedStore.load({
            callback: function () {
                var linkedGrid = Ext.getCmp('methvinLinkedTaskGrid');
                linkedGrid.getStore().allDataLoaded = true;

                var formulaStore = Ext.getCmp('methvinPricingFormulaTree').getStore();
                formulaStore.allDataLoadHandler();

                if (this.getCount() > 1) {
                    Ext.getCmp('methvinLinkedTaskGridContainer').show();
                    linkedGrid.getView().refresh();
                }
            }
        });
    },

    setPricingFormulaResourceStore: function (projectId) {

        if (this.pricingFormulaResourceStore == null) {
            this.pricingFormulaResourceStore = Ext.create('Pricing.store.estimation.ResourceTreeStore');
        }
        var store = this.pricingFormulaResourceStore;
        var api = store.getProxy().getApi();

        api.create = 'rest/estimation/addresources/' + projectId;
        api.read = 'rest/estimation/getresources/' + projectId;
        api.update = 'rest/estimation/updateresources/' + projectId;
        api.destroy = 'rest/estimation/deleteresources/' + projectId;

        store.load({
            callback: function () {
                Pricing.controller.Utilities.pricingFormulaResourceStore.allDataLoaded = true;
                Pricing.controller.Utilities.populatePricingFormulaComboStore(Pricing.controller.Utilities.pricingFormulaResourceStore.getRootNode());
                var formulaStore = Ext.getCmp('methvinPricingFormulaTree').getStore();
                formulaStore.allDataLoadHandler();
            }
        });
    },

    //  this would iterate through tree store and populate the leaf resources in the one dimensional array
    populatePricingFormulaComboStore: function (node, leafItems) {
        if (!leafItems) {
            leafItems = [];
        }
        if (node.childNodes.length > 0) {
            for (var index = 0, maxIndex = node.childNodes.length; index < maxIndex; index++) {
                Pricing.controller.Utilities.populatePricingFormulaComboStore(node.childNodes[index], leafItems);
            }
        }
        else if (node.getId() != 0) {
            leafItems.push({
                id: node.getId(),
                description: node.get('description'),
                isComplex: node.get('isComplex'),
                rate: node.get('rate')
            });
        }

        if (node.getId() == 0) {
            Pricing.controller.Utilities.pricingFormulaComboStore.setData(leafItems);
        }
    },

    showResourceAppender: function (resourceText, pricingFormulaId) {
        Pricing.controller.Utilities.pricingFormulaResourceStore.clearFilter();
        var win = Ext.create('widget.window', {
            title: 'Global Variables',
            id: 'methvinAddNewResourceWindow',
            modal: true,
            closable: false,
            width: 250,
            height: 400,
            items: [{
                layout: 'fit',
                border: 0,
                items: [{
                    xtype: 'methvinParentResourceTree',
                    store: Pricing.controller.Utilities.pricingFormulaResourceStore
                }]
            }]
        });

        Pricing.controller.Utilities.pricingFormulaResourceStore.newText = resourceText;
        Pricing.controller.Utilities.pricingFormulaResourceStore.pricingFormulaId = pricingFormulaId;
        win.show();
        win.focus();
    }


});