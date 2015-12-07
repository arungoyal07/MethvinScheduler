Ext.define('Pricing.view.main.SubmenuTabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'submenuTabPanel',
    width: 700,
    height: 40,
    defaults: {
        bodyPadding: 10,
        scrollable: true
    },
    items: [{
        id: 'submenuFeatures',
        title: 'Features'
    }, {
        id: 'submenuDesign',
        title: 'Design'
    }, {
        id: 'submenuPricingPlan',
        title: 'Pricing Plans'
    }, {
        id: 'submenuNews',
        title: 'News'
    }, {
        id: 'submenuContactUs',
        title: 'Contact Us'
    }, {
        id: 'submenuPricing',
        title: 'Pricing'
    }, {
        id: 'submenuResource',
        title: 'Resources'
    }],


    tabConfig: [{
        tabId: 'submenuFeatures',
        group: 'advertise',
        containerId: 'advertiseHomeContainer'
    }, {
        tabId: 'submenuDesign',
        group: 'advertise',
        containerId: 'advertiseDesignContainer'
    }, {
        tabId: 'submenuPricingPlan',
        group: 'advertise',
        containerId: 'advertisePricingPlanContainer'
    }, {
        tabId: 'submenuNews',
        group: 'advertise',
        containerId: 'advertiseNewsContainer'
    }, {
        tabId: 'submenuContactUs',
        group: 'advertise',
        containerId: 'advertiseContactUsContainer'
    }, {
        tabId: 'submenuPricing',
        containerId: 'methvinPricingTreeContainer'
    }, {
        tabId: 'submenuResource',
        containerId: 'methvinResourceTreeContainer'
    }, {
        tabId: '',//this container has no tabs
        containerId: 'methvinPricingFormulaTreeContainer'
    }],



    listeners: {
        tabchange: function (tabPanel, newCard, oldCard, eOpts) {
            //hide all tabs
            var tabconfigs = this.tabConfig;
            var currentTab = null;
            for (index in tabconfigs) {
                var tabconfig = tabconfigs[index];
                var container = Ext.getCmp(tabconfig.containerId);
                if (tabconfig.tabId == newCard.getId()) {
                    currentTab = container;
                }
                container.hide();
            }

            //show current tab
            currentTab.show();
            if (tabconfigs.activate) {
                tabconfigs.activate();
            }
        }
    }
});