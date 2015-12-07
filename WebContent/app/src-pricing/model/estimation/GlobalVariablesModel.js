Ext.define('Pricing.model.estimation.GlobalVariablesModel', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'id',
    identifier: 'negative',
    fields: [
        { name: "id", type: "int" },
        { name: "projectId", type: "int" },
        { name: "unit", type: "string" },
        { name: "variable", type: "string" },
        { name: "equation", type: "string" },
        { name: "value", type: "number" }
    ]
});