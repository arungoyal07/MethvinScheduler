Ext.define('Pricing.view.estimation.GlobalVariableGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.methvinGlobalVariableGrid',
    id: 'methvinGlobalVariableGrid',
    store: Pricing.controller.Utilities.globalVariableStore,
    border: 0,
    autoScroll: true,
    tbar: [{
        xtype: 'button',
        text: 'Add',
        handler: function () {
            var store = Ext.getCmp('methvinGlobalVariableGrid').getStore();
            var numItems = store.getCount();
            var sequenceId = 0;
            if (numItems > 0) {
                sequenceId = store.getAt(numItems - 1).get('sequenceId') + 1;
            }
            store.add({ sequenceId: sequenceId });
        }
    }, {
        xtype: 'button',
        text: 'Save',
        handler: function () {
            Ext.getCmp('methvinGlobalVariableGrid').getStore().sync();
        }
    }],
    plugins: [
             Ext.create('Ext.grid.plugin.CellEditing', {
                 clicksToEdit: 2,
                 listeners: {
                     edit: function (editor, eOpts) {
                         var grid = eOpts.grid;
                         var store = grid.getStore();
                         var column = grid.getView().getGridColumns()[eOpts.colIdx].dataIndex;
                         if (column == 'equation' || column == 'variable') {
                             //recalculate
                             var replacementArray = [];
                             for (var index = 0, maxIndex = store.getCount() ; index < maxIndex; index++) {
                                 var node = store.getAt(index);
                                 var variable = node.get('variable');
                                 var equation = node.get('equation');
                                 var value = 0;
                                 var isDate = false;
                                 if (equation != null && equation != '') {
                                     //check for dates
                                     if (equation.match(/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/)) {
                                         var result = equation.match(/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/);
                                         value = '(new Date(' + result[3] + ',' + (Number(result[2] )-1)+ ',' + result[1] + '))';
                                         isDate = true;
                                     }
                                     else {
                                         for (var repIndex = 0, maxRepIndex = replacementArray.length; repIndex < maxRepIndex; repIndex++) {
                                             equation = equation.replace(new RegExp("\\[" + replacementArray[repIndex][0] + "\\]"), replacementArray[repIndex][1]);
                                         }
                                         try {
                                             value = eval(equation);
                                             if (value==null || value=='' || isNaN(value) || value == "Infinity") {
                                                 grid.getStore().error = true;
                                                 return;
                                             }
                                         }
                                         catch (ex) {
                                             grid.getStore().error = true;
                                             return;
                                         }
                                     }
                                 }

                                 node.set('value', isDate?0:value);
                                 if (variable != null && variable != '') {
                                     replacementArray.push([variable, value]);
                                 }
                             }
                         }
                     }
                 }
             })
    ],
    columns: [
        {
            header: 'Variable',
            dataIndex: 'variable',
            flex: 1,
            editor: {
                xtype: 'textfield',
                maskRe: /[a-zA-Z_0-9]/
            }
        },
        {
            header: 'Unit',
            dataIndex: 'unit',
            flex: 1,
            editor: { xtype: 'textfield' }
        },
        {
            header: 'Equation',
            dataIndex: 'equation',
            flex: 2,
            editor: { xtype: 'textfield' }
        },
        {
            header: 'Value',
            dataIndex: 'value',
            flex: 1
        },
        {
            xtype: 'actioncolumn',
            width: 60,
            items: [{
                icon: 'extjs/examples/shared/icons/fam/cog_edit.png',
                tooltip: 'Delete',
                handler: function (grid, rowIndex, colindex) {
                    grid.getStore().remove(grid.getStore().getAt(rowIndex));
                }
            }]
        }]
});