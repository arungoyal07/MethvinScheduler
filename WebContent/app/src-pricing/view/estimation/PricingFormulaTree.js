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
        dataIndex: 'resourceId'
    }, {
        header: 'Rate',
        dataIndex: 'resourceRate',
        editor: { xtype: 'textfield' }
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