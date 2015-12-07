Ext.define('Pricing.view.viewcontroller.PricingFormulaTreeViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pricingFormulaTreeViewController',
    reSyncRequired: false,
    close: function () {
        Ext.getCmp('methvinPricingFormulaTree').getStore().sync({
            callback: function () {
                Ext.getCmp('methvinPricingTreeContainer').show();
                Ext.getCmp('methvinPricingFormulaTreeContainer').hide();
            }
        });
    },
    save: function () {
        var clientId = -1;
        var tree = Ext.getCmp('methvinPricingFormulaTree');
        var store = tree.getStore();
        var root = store.getRootNode();
        var syncArray = [];
        var parentClientId = -1;
        var taskId=store.linkedTaskId;
        var projectId=store.projectId;
        var sequenceId=0;//doesn't matter if kept all the way incremented
        for (var index = 0, maxIndex = root.childNodes.length; index < maxIndex; index++) {
            var node = root.childNodes[index];
            parentClientId = clientId--;
            syncArray.push(this.cloneFormula(node, 0, sequenceId++, parentClientId,taskId,projectId));
            for (var innerIndex = 0, maxInnerIndex = node.childNodes.length; innerIndex < maxInnerIndex; innerIndex++) {
                syncArray.push(this.cloneFormula(node.childNodes[innerIndex], parentClientId, sequenceId++, parentClientId, taskId, projectId));
            }
        }
        console.log(syncArray);
    },
    cloneFormula: function (node, parentId, sequenceId, clientId, taskId, projectId) {
        return {
            description: node.get('description'),
            taskId: taskId,
            projectId: projectId,
            resourceId: node.get('resourceId'),
            resourceRate: node.get('resourceRate'),
            unit: node.get('unit'),
            variable: node.get('variable'),
            quantity: node.get('quantity'),
            equation: node.get('equation'),
            value: node.get('value'),
            rate: node.get('rate'),
            expanded: node.get('expanded'),
            parentId: parentId,
            sequenceId: sequenceId,
            cls: node.get('cls'),
            color: node.get('color'),
            clientId: clientId
        };
    },
    addPricingFormula: function () {
        var tree = Ext.getCmp('methvinPricingFormulaTree');
        var selection = tree.getSelectionModel().getSelection();
        var store = tree.getStore();
        var root = store.getRootNode();
        var parent = root;
        var index = null;
        if (selection && selection.length > 0) {
            var node = selection[0];
            if (node.parentNode == store.getRootNode()) {
                parent = node;
            }
            else if (node.parentNode.parentNode == root) {
                parent = node.parentNode;
                index = node.parentNode.indexOf(selection) + 1;
            }
        }

        if (index) {
            parent.insertChild(index, { leaf: true });
        }
        else {
            parent.appendChild({ leaf: true });
        }

        if (parent != root) {
            if (!parent.isLeaf()) {
                parent.set('leaf', false);
            }
            if (!parent.isExpanded()) {
                parent.expand();
            }
            if (parent.childNodes.length == 1) {
                parent.set('resourceId', 0);
                parent.set('resourceRate', 0);
                parent.set('unit', null);
                parent.set('variable', null);
                parent.set('quantity', 0);
                parent.set('equation', null);
                parent.set('value', 0);
                parent.set('rate', 0);
            }
        }

        //recalculate
    },
    deletePricingFormula: function () {
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
    indentPricingFormula: function () {

    },
    outdentPricingFormula: function () {
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

    beforeedit: function (editor, e, eOpts) {

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