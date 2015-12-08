Ext.define('Pricing.view.estimation.ParentResourceTree', {
    extend: 'Ext.tree.Panel',
    border: false,
    alias: 'widget.methvinParentResourceTree',
    border: false,
    id: 'methvinParentResourceTree',
    rootVisible: true,
    multiSelect: false,
    height: 360,
    columns: [{
        xtype: 'treecolumn',
        text: 'Item',
        flex: 1,
        dataIndex: 'description',
        allownumbers: false,
        sortable: true
    }],
    bbar: [{
        xtype: 'button',
        text: 'Add',
        handler: function () {
            var grid = Ext.getCmp('methvinParentResourceTree');
            var selection = grid.getSelectionModel().getSelection();
            if (selection.length > 0) {
                var parentNode = selection[0];
                parentNode.appendChild({ leaf: true, description: grid.getStore().newText,rate:10 });
                Pricing.controller.Utilities.populatePricingFormulaComboStore(Pricing.controller.Utilities.pricingFormulaResourceStore.getRootNode());
                var newRecordId = parentNode.childNodes[parentNode.childNodes.length - 1].getId();
                var selectedFormula = Ext.getCmp('methvinPricingFormulaTree').getSelectionModel().getSelection()[0];
                selectedFormula.set('resourceId', newRecordId);
                selectedFormula.set('resourceRate', 10);
                Ext.getCmp('methvinAddNewResourceWindow').close();
            }
        }
    }, {
        xtype: 'button',
        text: 'cancel',
        handler: function () {
            var selectedFormula = Ext.getCmp('methvinPricingFormulaTree').getSelectionModel().getSelection()[0];
            selectedFormula.set('resourceId', null);
            Ext.getCmp('methvinAddNewResourceWindow').close();
        }
    }]
});