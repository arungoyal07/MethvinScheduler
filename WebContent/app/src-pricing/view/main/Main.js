Ext.define('Pricing.view.main.Main', {
    extend: 'Ext.Viewport',
    requires: ['Ext.plugin.Viewport', 'Ext.window.MessageBox',
        //common
        'Pricing.view.main.SubmenuTabPanel', 'Pricing.controller.Utilities', 'Pricing.controller.HtmlPanelExtender',
        //pricing tree
        'Pricing.model.estimation.PricingTreeModel', 'Pricing.store.estimation.PricingTreeStore',
        'Pricing.view.viewcontroller.PricingTreeViewController', 'Pricing.view.estimation.PricingTree',
        //pricing formulae
        'Pricing.model.estimation.PricingFormulaTreeModel', 'Pricing.store.estimation.PricingFormulaTreeStore',
        'Pricing.view.estimation.PricingFormulaTree', 'Pricing.view.viewcontroller.PricingFormulaTreeViewController',
        //linked task grid
        'Pricing.model.estimation.PricingFormulaGridModel',
        'Pricing.store.estimation.LinkedTaskStore', 'Pricing.view.estimation.LinkedTaskGrid',
        //project tree Panel
        'Pricing.model.estimation.ProjectTreeModel', 'Pricing.store.estimation.ProjectTreeStore',
        'Pricing.view.viewcontroller.ProjectTreeViewController', 'Pricing.view.estimation.ProjectTree',
        //Global variable
        'Pricing.model.estimation.GlobalVariablesModel', 'Pricing.store.estimation.GlobalVariablesStore',
        'Pricing.view.estimation.GlobalVariableGrid',
        //Resource components
        'Pricing.model.estimation.ResourceTreeModel', 'Pricing.store.estimation.ResourceTreeStore',
        'Pricing.view.estimation.ResourceTree', 'Pricing.view.estimation.ParentResourceTree'
    ],
    layout: 'border',
    border: 0,
    items: [{
        region: 'north',
        split: true,
        height: 70,
        items: [{
            layout: 'hbox',
            border: 0,
            items: [{
                html: '<img src="app/resources/images/home.png"/>',
                width: 130,
                height: 60,
                padding: 15,
                border: 0
            }, {
                layout: 'vbox',
                flex: 1,
                border: 0,
                padding: '0 0 0 40px',
                items: [{
                    layout: 'hbox',
                    border: 0,
                    items: [{
                        html: '<img src="app/resources/images/home.png"/><span style="font-family:arial;font-size:18px;padding-left:5px">Home</span>',
                        border: 0,
                        padding: 5
                    }, {
                        html: '<img src="app/resources/images/estimation.png"/><span style="color:#bbb;font-family:arial;font-size:18px;padding-left:5px">Estimation</span>',
                        border: 0,
                        padding: 5
                    }, {
                        html: '<img src="app/resources/images/publish.png"/><span style="color:#bbb;font-family:arial;font-size:18px;padding-left:5px">Publish</span>',
                        border: 0,
                        padding: 5
                    }, {
                        html: '<img src="app/resources/images/project.png"/><span style="color:#bbb;font-family:arial;font-size:18px;padding-left:5px">Tender</span>',
                        border: 0,
                        padding: 5
                    }]
                }, {
                    layout: 'hbox',
                    border: 0,
                    items: [{
                        id: 'methvinSubmenuTabPanel',
                        xtype: 'submenuTabPanel'
                    }]
                }]
            }]
        }]
    },

	//east region
	{
	    region: 'west',
	    width: 250,
	    split: true,
	    collapsible: true,
	    preventHeader: true,
	    collapseMode: 'mini',
	    items: [{
	        id: 'methvinProjectTreeContainer',
	        items: [{
	            xtype: 'methvinProjectTree'
	        }]
	    }]
	},

	//west region
	{
	    region: 'east',
	    width: 250,
	    border: 0,
	    split: true,
	    html: 'west region',
	    hidden: true
	},

	//center region
	{
	    region: 'center',
	    layout: 'fit',
	    items: [
            {
                id: 'advertiseHomeContainer',
                xtype: 'htmlPanelExtender',
                scroll: 'vertical',
                border: 0,
                autoLoad: true,
                url: 'templates/adminhome.html'
            }, {
                id: 'advertiseDesignContainer',
                xtype: 'htmlPanelExtender',
                scroll: 'vertical',
                border: 0,
                autoLoad: false,
                url: 'templates/admindesign.html'
            }, {
                id: 'advertisePricingPlanContainer',
                xtype: 'htmlPanelExtender',
                scroll: 'vertical',
                border: 0,
                autoLoad: false,
                url: 'templates/adminpricingplan.html'
            }, {
                id: 'advertiseNewsContainer',
                xtype: 'htmlPanelExtender',
                scroll: 'vertical',
                border: 0,
                autoLoad: false,
                url: 'templates/adminnews.html'
            }, {
                id: 'advertiseContactUsContainer',
                xtype: 'htmlPanelExtender',
                scroll: 'vertical',
                border: 0,
                autoLoad: false,
                url: 'templates/admincontactus.html'
            }, {
                id: 'methvinPricingTreeContainer',
                border: 0,
                layout: 'fit',
                hidden: true,
                items: [{ xtype: 'methvinPricingTree' }]
            }, {
                id: 'methvinPricingFormulaTreeContainer',
                border: 0,
                layout: 'fit',
                hidden: true,
                items: [{ xtype: 'methvinPricingFormulaTree' }]
            }, {
                id: 'methvinResourceTreeContainer',
                border: 0,
                hidden: true,
                layout: 'fit',
                html: 'resoures would come here'
            }]
	}]
});