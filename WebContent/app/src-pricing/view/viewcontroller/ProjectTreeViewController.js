Ext.define('Pricing.view.viewcontroller.ProjectTreeViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.projectTreeViewController',
    reSyncRequired: false,
    checkAndReSync: function () {
        var store = Ext.getCmp('methvinProjectTree').getStore();
        if (this.reSyncRequired && !store.isSyncing) {
            this.resynch = false;
            store.sync({
                callback: this.checkAndReSync
            });
        }
    },
    showProjectContextMenu: function (view, record, HTMLTarget, index, event) {
        event.stopEvent();
        var menu = this.contextMenu;
        menu.record = record;
        menu.HTMLTarget = HTMLTarget;
        menu.showAt(event.getXY());
    },
    projectNameEdit: function () {
        console.log('worked')
        this.reSyncRequired = true;
        this.checkAndReSync();
    },
    projectTreeClick: function (tree, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if (record.get('type') > 0) {
            //get active tab
            Ext.getCmp('methvinSubmenuTabPanel').setActiveItem(Ext.getCmp('methvinSubmenuTabPanel').items.getByKey('submenuPricing'))

            var projectId = record.getId();
            if (Pricing.controller.Utilities.projectId == null || Pricing.controller.Utilities.projectId != projectId) {
                //global variable store initialization only happens first time
                if (Pricing.controller.Utilities.globalVariableStore == null) {
                    Pricing.controller.Utilities.globalVariableStore = Ext.create('Pricing.store.estimation.GlobalVariablesStore');
                }

                Pricing.controller.Utilities.setProjecProxies(projectId);
                var pricingTree = Ext.getCmp('methvinPricingTree');
                var pricingStore = pricingTree.getStore();
                pricingStore.load({
                    callback: function () {
                        pricingStore.getRootNode().expand();
                        pricingTree.getView().refresh();
                    }
                });

                Pricing.controller.Utilities.globalVariableStore.load();
            }

        }
    },
    contextMenu: new Ext.menu.Menu({
        record: null,
        items: [
        {
            text: 'New Project',
            iconCls: 'pricing-add',
            handler: function (menu) {
                var treeStore = Ext.getCmp('methvinProjectTree').getStore();
                var record = menu.parentMenu.record;
                if (record != treeStore.getRootNode() && record.phantom) {
                    Ext.Msg.alert('Wait!', 'Please wait for few seconds while previous operation is in progress.');
                    return;
                }
                if (record.get('type') != 0) {//its not a label
                    Ext.Msg.alert('Error!', 'Project can only be added inside a folder');
                    return;
                }

                Ext.MessageBox.prompt('Input', 'Please enter project name', function (btn, text) {
                    if (btn == 'ok') {
                        var sequenceId = record.hasChildNodes() ? record.childNodes[record.childNodes.length - 1].get('sequenceId') + 1 : 0;
                        record.appendChild({
                            leaf: true,
                            description: text,
                            type: 1,
                            sequenceId: sequenceId
                        });
                        if (record.isLeaf()) {
                            record.set('leaf', false);
                        }
                        if (!record.isExpanded()) {
                            record.expand();
                        }
                        var treeStore = Ext.getCmp('methvinProjectTree');
                        treeStore.controller.reSyncRequired = true;
                        treeStore.controller.checkAndReSync();
                    }
                });
            }
        }, {
            text: 'New Folder',
            iconCls: 'pricing-add',
            handler: function (menu) {
                var treeStore = Ext.getCmp('methvinProjectTree').getStore();
                var record = menu.parentMenu.record;
                if (record != treeStore.getRootNode() && record.phantom) {
                    Ext.Msg.alert('Wait!', 'Please wait for few seconds while previous operation is in progress.');
                    return;
                }
                if (record.get('type') != 0) {//its not a label
                    Ext.Msg.alert('Error!', 'Folder can only be added inside a folder');
                    return;
                }

                Ext.MessageBox.prompt('Input', 'Please enter folder name', function (btn, text) {
                    if (btn == 'ok') {
                        var sequenceId = record.hasChildNodes() ? record.childNodes[record.childNodes.length - 1].get('sequenceId') + 1 : 0;
                        record.appendChild({
                            leaf: true,
                            description: text,
                            type: 0,
                            sequenceId: sequenceId
                        });
                        if (record.isLeaf()) {
                            record.set('leaf', false);
                        }
                        if (!record.isExpanded()) {
                            record.expand();
                        }
                        var treeStore = Ext.getCmp('methvinProjectTree');
                        treeStore.controller.reSyncRequired = true;
                        treeStore.controller.checkAndReSync();
                    }
                });
            }
        }, {
            text: 'Delete',
            iconCls: 'pricing-add',
            handler: function (menu) {
                var treeStore = Ext.getCmp('methvinProjectTree').getStore();
                var record = menu.parentMenu.record;
                if (record == treeStore.getRootNode()) {
                    return;
                }
                Ext.Msg.confirm('Delete?', 'Are you sure you want to delete this item and all its children?', function (btn) {
                    if (btn == 'yes') {
                        record.remove();
                        var treeStore = Ext.getCmp('methvinProjectTree');
                        treeStore.controller.reSyncRequired = true;
                        treeStore.controller.checkAndReSync();
                    }
                });
            }
        }, {
            text: 'Global Variables',
            iconCls: 'pricing-add',
            handler: function (menu) {
                var grid = Ext.create('Pricing.view.estimation.GlobalVariableGrid');
                var win = Ext.create('widget.window', {
                    title: 'Global Variables',
                    id: 'methvinGlobalVariableWindow',
                    modal: true,
                    closable: true,
                    width: 600,
                    height: 400,
                    items: [{
                        layout: 'fit',
                        border: 0,
                        items: [grid]
                    }],
                    listeners: {
                        beforeclose: function () {
                            var store = Ext.getCmp('methvinGlobalVariableGrid').getStore();
                            if (store.getNewRecords().length + store.getUpdatedRecords().length + store.getRemovedRecords().length > 0) {
                                Ext.Msg.confirm('Unsaved Changes', 'There are some unsaved changes. Do you want to save them?', function (result) {
                                    if (result == 'yes') {
                                        Ext.getCmp('methvinGlobalVariableGrid').getStore().sync({
                                            callback: function () {
                                                Ext.getCmp('methvinGlobalVariableWindow').close();
                                            }
                                        });
                                    }
                                    else {
                                        Ext.getCmp('methvinGlobalVariableGrid').getStore().rejectChanges();
                                        Ext.getCmp('methvinGlobalVariableWindow').close();
                                    }
                                });
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                    }
                });
                Ext.getCmp('methvinGlobalVariableGrid').setStore(Pricing.controller.Utilities.globalVariableStore);
                win.show();
                win.focus();
            }
        }]
    })
});