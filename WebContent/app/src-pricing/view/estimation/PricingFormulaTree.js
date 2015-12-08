Ext.define('Pricing.view.estimation.PricingFormulaTree', {
    extend: 'Ext.tree.Panel',
    border: false,
    alias: 'widget.methvinPricingFormulaTree',
    store: Ext.create('Pricing.store.estimation.PricingFormulaTreeStore'),
    border: false,
    autoWidth: true,
    autoHeight: true,
    region: 'center',
    id: 'methvinPricingFormulaTree',
    rootVisible: false,
    layout: 'fit',
    multiSelect: true,
    controller: 'pricingFormulaTreeViewController',
    plugins: [
             Ext.create('Ext.grid.plugin.CellEditing', {
                 clicksToEdit: 2
             })
    ],
    tbar: [{
        tooltip: 'Add item',
        xtype: 'button',
        text: 'Add',
        handler: 'addPricingFormula'
    },
    {
        tooltip: 'Delete item',
        xtype: 'button',
        text: 'Delete',
        handler: 'deletePricingFormula'
    },
    {
        tooltip: 'Outdent',
        xtype: 'button',
        text: 'Outdent',
        handler: 'outdentPricingFormula'
    },
     {
         tooltip: 'Indent',
         xtype: 'button',
         text: 'Indent',
         handler: 'indentPricingFormula'
     },
     '->', {
         xtype: 'button',
         align: 'right',
         text: 'close',
         handler: 'close'
     }, {
         xtype: 'button',
         align: 'right',
         text: 'save',
         handler: 'save'
     }],
    dockedItems: [{
        hidden: true,
        dock: 'bottom',
        id: 'methvinLinkedTaskGridContainer',
        items: [{ xtype: 'methvinLinkedTaskGrid' }],
        border: 0,
        height: 200
    }],
    columns: [{
        xtype: 'treecolumn',
        header: 'Item',
        width: 160,
        dataIndex: 'item',
        allownumbers: false,
        sortable: true,
        editor: { xtype: 'textfield' }
    }, {
        header: 'Resource',
        dataIndex: 'resourceId',
        editor: {
            xtype: 'combo',
            allowBlank: true,
            emptyText: 'choose Resources',
            displayField: 'description',
            valueField: 'id',
            queryMode: 'local',
            typeAhead: true,
            store: Pricing.controller.Utilities.pricingFormulaComboStore,
            listeners: {
                /*beforequery: function (queryPlan) {
                    var store = queryPlan.combo.getStore();
                    store.clearFilter();
                    var regEx = new RegExp(".*" + queryPlan.query + ".*");
                    store.filterBy(function (record) {
                        var desc = record.get('description');
                        return desc ? desc.match(regEx) != null : false;
                    });
                    return false;
                },*/
                blur: function (combo) {
                    if (combo.value != null && combo.value != '0') {
                        if (isNaN(combo.value) || !Pricing.controller.Utilities.pricingFormulaComboStore.getById(Number(combo.value))) {//selected text does not belong to any of the resource
                            var selectedRecord = Ext.getCmp('methvinPricingFormulaTree').getSelectionModel().getSelection()[0];
                            Pricing.controller.Utilities.showResourceAppender(combo.value, selectedRecord.getId());
                        }
                        else {
                            var item = Pricing.controller.Utilities.pricingFormulaComboStore.getById(Number(combo.value));
                            var selectedFormula = Ext.getCmp('methvinPricingFormulaTree').getSelectionModel().getSelection()[0];
                            selectedFormula.set('resourceId', item.getId());
                            selectedFormula.set('resourceRate', item.get('rate'));
                        }
                    }
                    return true;
                }
            }
        }
    }, {
        header: 'Rate',
        dataIndex: 'resourceRate',
        editor: {
            xtype: 'textfield',
            maskRe: /0-9./
        }
    }, {
        header: 'Unit',
        dataIndex: 'unit'
    }, {
        header: 'Variable',
        dataIndex: 'variable',
        editor: {
            xtype: 'textfield',
            maskRe: /[a-zA-Z_0-9]/
        }
    }, {
        header: 'Equation',
        dataIndex: 'equation',
        editor: { xtype: 'textfield' }
    }, {
        header: 'Value',
        dataIndex: 'value'
    }, {
        header: 'Amount',
        dataIndex: 'value',
        renderer: function () {
            //debugger here
        }
    }]
});