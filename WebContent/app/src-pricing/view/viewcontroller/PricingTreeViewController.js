Ext.define('Pricing.view.viewcontroller.PricingTreeViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pricingTreeViewController',
    reSyncRequired: false,
    bulkCount: 2,
    reloadTree: function () {
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var scrollYPosition = methvinPricingTree.view.getScrollY();
        methvinPricingTree.getStore().reload({
            callback: function () {
                methvinPricingTree.view.setScrollY(scrollYPosition);
            }

        });
    },
    checkAndReSync: function () {
        var store = Ext.getCmp('methvinPricingTree').getStore();
        if (this.reSyncRequired && !store.isSyncing) {
            this.resynch = false;
            store.sync({
                callback: this.checkAndReSync
            });
        }
    },
    onCellDblClick: function (iView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if (!record.phantom && record.isLeaf()) {
            var column = iView.getGridColumns()[cellIndex].dataIndex;
            if (column == 'costRate' || column == 'costAmount') {
                var pricingTree = Ext.getCmp('methvinPricingTree');
                var pricingStore = pricingTree.getStore();
                pricingTree.setLoading(true);

                Pricing.controller.Utilities.setLinkedTaskProxy(pricingStore.projectId, record); 
                Pricing.controller.Utilities.setPricingFormulaResourceStore(pricingStore.projectId);
                Pricing.controller.Utilities.setPricingFormulaStore(pricingStore.projectId, record);

            }
        }
    },
    addPricingTask: function () {
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var selectedItems = methvinPricingTree.getSelectionModel().getSelection();
        var parentNode = methvinPricingTree.getRootNode();
        if (selectedItems.length > 0) {
            parentNode = selectedItems[0];
        }
        if (!parentNode.isRoot() && parentNode.phantom) {
            return;
        }
        if (parentNode.get('linkedTaskId') > 0) {
            Ext.Msg.alert("Error", "Can not add task to a link task.");
            return;
        }
        var sequenceId = (parentNode.childNodes.length > 0 ? parentNode.childNodes[parentNode.childNodes.length - 1].get('sequenceId') + 1 : 0);
        var newItem = {
            item: 'New Task',
            parentId: 0,
            leaf: true,
            sequenceId: sequenceId
        };

        parentNode.appendChild(newItem);
        if (!parentNode.isExpanded()) {
            parentNode.expand();
        }
        this.reSyncRequired = true;
        this.checkAndReSync();
    },
    getAllChildNodes: function (node, taskIds) {
        if (node !== null) {
            if (node.hasChildNodes()) {
                node.eachChild(function (n) {
                    var methvinPricingTree = Ext.getCmp('methvinPricingTree');
                    methvinPricingTree.controller.getAllChildNodes(n, taskIds);
                });
                if (!node.phantom) {
                    taskIds.push(node.getId());
                }
            }
            else {
                if (!node.phantom) {
                    taskIds.push(node.getId());
                }
            }
        }
    },
    deletePricingTask: function () {
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var selectedItems = methvinPricingTree.getSelectionModel().getSelection();
        if (selectedItems.length > 0) {

            for (var index = 0; index < selectedItems.length; index++) {
                var currentNode = selectedItems[index];
                if (currentNode != null && currentNode.phantom) {
                    Ext.Msg.alert("Warning", "There is already a operation going. PLease wait and try after some time.")
                    return;
                }
            }

            var treeController = this;
            Ext.Msg.confirm("Warning", "Are you sure you want to delete selected tasks?", function (result) {
                if (result == 'yes') {
                    if (selectedItems.length > treeController.bulkCount) {
                        var idsToBeDeleted = [];
                        for (var i = 0; i < selectedItems.length; i++) {
                            treeController.getAllChildNodes(selectedItems[i], idsToBeDeleted);
                        }
                        var records = {};
                        records.bulkIds = idsToBeDeleted;
                        Ext.Ajax.request({
                            url: 'rest/estimation/bulkupdates/' + methvinPricingTree.getStore().projectId,
                            jsonData: records,
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            success: function (result, request) {
                                // Ext.getCmp('cal').addCls('cal');
                                Ext.getCmp('methvinPricingTree').getStore().reload();
                            },
                        });
                    }
                    else {
                        for (var index = 0; index < selectedItems.length; index++) {
                            var currentNode = selectedItems[index];
                            var parentNode = currentNode.parentNode;
                            currentNode.remove();
                            if (parentNode != null && parentNode.childNodes.length == 0) {
                                parentNode.set('leaf', true);
                            }
                        }
                        treeController.reSyncRequired = true;
                        treeController.checkAndReSync();
                    }
                }
            });
        }
    },
    editPricing: function (editor, e, eOpts) {
        this.reSyncRequired = true;
        this.checkAndReSync();
    },
    indentPricingTask: function () {
        var treeController = this;
        var projectId = 0;
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var selection = methvinPricingTree.getSelectionModel().getSelection();
        //check if selected task has parent node 
        if (selection.length > 0) {
            for (var index = 0; index < selection.length; index++) {
                var currentNode = selection[index];
                if (currentNode != null && currentNode.phantom) {
                    Ext.Msg.alert("Warning", "There is already a ongoing operation. PLease wait and try after some time.")
                    return;
                }
            }

            //check if all selected items has same parent
            var parentNode = selection[0].parentNode;
            for (var index = 0; index < selection.length; index++) {
                if (parentNode != selection[index].parentNode) {
                    Ext.Msg.alert("Error", "Can not perform as task should be of same level");
                    return;
                }
            }

            var root = selection[0].parentNode;

            var orderedList = [];

            for (var index in root.childNodes) {
                var node = root.childNodes[index];
                if (selection.indexOf(node) >= 0) {
                    orderedList.push(node);
                }
            }

            var parentNode = orderedList[0].previousSibling;
            if (parentNode == null) {
                Ext.Msg.alert("Error", "Can not perform the operation");
                return;
            }
            if (parentNode.get('quantity') != 0) {
                Ext.Msg.alert("Error", "Quantity of parent task should be zero");
                return;
            }

            else {
                var isAllowed = true;
                if (parentNode.get('linkedTaskId') > 0) {
                    Ext.Msg.confirm("Warning", "The parent has pricing formulae attached. Do you want to delete the formulae?", function (result) {
                        if (result != 'yes') {
                            isAllowed = false;
                        }
                    });
                }

                if (isAllowed) {
                    if (selection.length > this.bulkCount) {
                        var ids = [];
                        for (var index = 0; index < selection.length; index++) {
                            ids.push(selection[index].getId());
                        }

                        Ext.Ajax.request({
                            url: 'rest/estimation/bulkindentpricingtasks/' + methvinPricingTree.getStore().projectId,
                            jsonData: { bulkIds: ids, parentId: parentNode.getId() },
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            success: function (result, request) {
                                if (!parentNode.isExpanded()) {
                                    parentNode.expand();
                                }
                                treeController.reloadTree();
                            },
                        });
                    }
                    else {
                        var sequenceId = 1;
                        if (parentNode.hasChildNodes()) {
                            sequenceId = parentNode.childNodes.length + 1;
                        }
                        for (var index in orderedList) {
                            var node = orderedList[index];
                            if (node) {
                                node.set('sequenceId', sequenceId);
                                parentNode.appendChild(node);
                                sequenceId++;
                            }
                        }
                        if (!parentNode.isLeaf()) {
                            parentNode.set('leaf', false);
                        }

                        if (!parentNode.isExpanded()) {
                            parentNode.expand();
                        }
                    }
                }
            }
        }
    },
    outdentPricingTask: function () {
        var treeController = this;
        var projectId = 0;
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var selection = methvinPricingTree.getSelectionModel().getSelection();
        //check if selected task has parent node 
        if (selection.length > 0) {
            var parentNode = selection[0].parentNode;
            for (var index = 0; index < selection.length; index++) {
                var currentNode = selection[index];
                if (currentNode != null && currentNode.phantom) {
                    Ext.Msg.alert("Warning", "There is already a ongoing operation. Please wait and try after some time.")
                    return;
                }
                if (parentNode != selection[index].parentNode) {
                    Ext.Msg.alert("Error", "Can not perform as task should be of same level");
                    return;
                }
                if (selection[0].parentNode.isRoot()) {
                    Ext.Msg.alert("Error", "Can not perform as one of the selected task is already outdented");
                    return;
                }
            }

            var orderedList = [];
            //arrange sellected ids 
            for (var index in parentNode.childNodes) {
                var node = parentNode.childNodes[index];
                if (selection.indexOf(node) >= 0) {
                    orderedList.push(node);
                }
            }

            var sequenceId = 1;
            if (orderedList.length > this.bulkCount) {
                var idsToBeOutDent = [];
                alert('to be implemented');
                for (var index in orderedList) {
                    var node = orderedList[index];
                    if (node) {
                        idsToBeOutDent.push(node.getId());
                        Ext.Ajax.request({
                            url: 'rest/estimation/bulkoutdent/1',
                            jsonData: { bulkids: idsToBeOutDent },
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            success: function (result, request) {
                                // Ext.getCmp('cal').addCls('cal');
                                Ext.getCmp('methvinPricingTree').getStore().reload();
                            },
                        });
                    }
                }
            }
            else {
                for (var index in orderedList) {
                    var node = orderedList[index];
                    if (node) {
                        if (parentNode.nextSibling) {
                            sequenceId = 0;
                            sequenceId = parentNode.nextSibling.get('sequenceId');
                            node.set('sequenceId', sequenceId++);
                            parentNode.parentNode.insertBefore(node, parentNode.nextSibling);
                            parentNode.nextSibling.set('sequenceId', sequenceId++);
                            //update sequenceId of all columns 
                            var nextSibling = parentNode.nextSibling;
                            while (nextSibling.nextSibling) {
                                nextSibling.set('sequenceId', sequenceId++);
                                nextSibling = nextSibling.nextSibling
                            }

                        } else {
                            sequenceId = 0;
                            if (parentNode.parentNode.hasChildNodes()) {
                                sequenceId = parentNode.parentNode.childNodes[parentNode.parentNode.childNodes.length - 1].get('sequenceId');

                            }
                            node.set('sequenceId', sequenceId + 1);
                            parentNode.parentNode.appendChild(node);
                        }
                        if (!parentNode.hasChildNodes()) {
                            parentNode.set('leaf', true);
                        }

                    }
                }
                this.reSyncRequired = true;
                this.checkAndReSync();
            }
        }
    },
    addPricingWorksheet: function () { },
    linkSelectedTasks: function () {
        if (Ext.getCmp('methvinPricingTree').getSelectionModel().hasSelection()) {
            var selection = Ext.getCmp('methvinPricingTree').getSelectionModel().getSelection();
            if (selection.length > 1) {
                var linkedIds = [];
                var isAllowed = true;
                var costRate = 0;
                for (var index = 0, max = selection.length; index < max; index++) {
                    var node = selection[index];
                    if (!node.isLeaf()) {
                        Ext.Msg.alert('Can\'t link!', 'Tasks to be linked must be leaf tasks');
                        isAllowed = false;
                        return;
                    }
                    if (node.get('linkedTaskId') > 0 && linkedIds.indexOf(node.get('linkedTaskId')) < 0) {
                        costRate = node.get('costRate');
                        linkedIds.push(node.get('linkedTaskId'));
                    }
                }

                if (linkedIds.length == 0) {
                    isAllowed = false;
                    Ext.Msg.alert('Can\'t link!', 'Atleast one task must have a pricing sheet!');
                    return;
                }

                if (linkedIds.length > 1) {
                    isAllowed = false;
                    Ext.Msg.alert('Can\'t link!', 'There must be exactly one task in the selection having pricing sheet attached!');
                    return;
                }
                else if (isAllowed) {
                    for (var index = 0, max = selection.length; index < max; index++) {
                        var node = selection[index];
                        node.set('linkedTaskId', linkedIds[0]);
                        node.set('costRate', costRate);
                    }
                    this.reSyncRequired = true;
                    this.checkAndReSync();
                }
            }
            else {
                Ext.Msg.alert('Can\'t link!', 'At least two task must be selected and one of them should have pricing sheet attached.');
                return;
            }
        }
    },
    beforeedit: function (editor, e, eOpts) {
        var node = Ext.getCmp('methvinPricingTree').getSelectionModel().getSelection()[0];
        var colHeader = e.column.text;
        if (node.hasChildNodes()) {
            if (colHeader == 'Quantity') {
                return false;
            }
        }
    },
    itemexpand: function (node, a, b) {
        if (node.getId() > 0) {
            this.reSyncRequired = true;
            this.checkAndReSync();
        }
    },
    itemcollapse: function (node) {
        if (node.getId() > 0) {
            this.reSyncRequired = true;
            this.checkAndReSync();
        }
    },
    createSubschedule: function () {
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var selectedItems = methvinPricingTree.getSelectionModel().getSelection();
        if (selectedItems.length > 0) {
            var node = selectedItems[0];
            var isAllowed = true;
            if (node.get("isSubScheduler")) {
                isAllowed = false;
                Ext.Msg.alert("Message", "Task is already subschduled");
                return;
            }
            while (node.parentNode && !node.parentNode.isRoot()) {
                if (node.parentNode.get("isSubScheduler")) {
                    isAllowed = false;
                    break;
                }
                node = node.parentNode;
            }
            if (!isAllowed) {
                Ext.Msg.alert("Message", "Task is already subschduled");
                return;
            }
            if (isAllowed) {
                node.set("isSubScheduler", true);
                this.reSyncRequired = true;
                this.checkAndReSync();
            }
        }

    },
    applyStyles: function (cssToBeapplied) {
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var selectedItems = methvinPricingTree.getSelectionModel().getSelection();
        if (selectedItems.length > 0) {
            var isChanged = false;
            for (var index = 0; index < selectedItems.length; index++) {
                var node = selectedItems[index];
                var cls = node.get('cls');
                if (cls.indexOf(cssToBeapplied) < 0) {
                    isChanged = true;
                    node.set('cls', cls + ' ' + cssToBeapplied);
                }
            }
            if (isChanged) {
                this.reSyncRequired = true;
                this.checkAndReSync();
            }
        }
    },
    resetStyles: function () {
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var selectedItems = methvinPricingTree.getSelectionModel().getSelection();
        if (selectedItems.length > 0) {
            for (var index = 0; index < selectedItems.length; index++) {
                var node = selectedItems[index];
                var cls = '';
                if (node.get('cls').indexOf('color-green') > -1) {
                    cls = 'color-green';
                }
                node.set('cls', cls);
            }
            this.reSyncRequired = true;
            this.checkAndReSync();
        }
    },
    applyBoldStyles: function () {
        this.applyStyles('cls-b');
    },
    applyItalicStyles: function () {
        this.applyStyles('cls-i');
    },
    applyUnderlineStyles: function () {
        this.applyStyles('cls-u');
    },
    applyStrikeThroughStyles: function () {
        this.applyStyles('cls-s');
    },
    setColors: function (menuItem, choice, rowIndex, colIndex) {
        var methvinPricingTree = Ext.getCmp('methvinPricingTree');
        var selectedItems = methvinPricingTree.getSelectionModel().getSelection();
        if (selectedItems.length > 0) {
            var isChanged = false;
            for (var index = 0; index < selectedItems.length; index++) {
                var node = selectedItems[index];
                var cls = node.get('cls');
                if (cls.indexOf('col-') > 0) {
                    var index = cls.indexOf('col-');
                    cls.substring(0, index) + 'col-' + choice.toUpperCase() + cls.substring(index + 10);
                }
                else {
                    cls += ' col-' + choice.toUpperCase();
                }
                node.set('cls', node.get('cls') + cls);
            }
            this.reSyncRequired = true;
            this.checkAndReSync();
        }
    }
});