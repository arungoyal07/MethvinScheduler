/*
 * @class Gnt.column.ResourceName
 * @extends Ext.grid.Column
 * @private
 * Private class used inside Gnt.widget.AssignmentGrid.
 */
Ext.define('Gnt.column.ResourceName', {
    extend         : 'Ext.grid.column.Column',
    alias          : 'widget.resourcenamecolumn',
    mixins         : ['Gnt.mixin.Localizable'],

    dataIndex      : 'ResourceName',
    flex           : 1,
    align          : 'left',

    constructor : function (config) {
        config = config || {};

        this.text   = config.text || this.L('text');
        
        Ext.apply(this, config);

        this.callParent(arguments);
    }
});
