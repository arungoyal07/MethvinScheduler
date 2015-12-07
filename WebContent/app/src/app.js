Ext.application({
    name: 'methwin.client',
    appFolder:'app/src',
    extend: 'methwin.client.Application',
    autoCreateViewport: true,
    controllers: [
    	'Navigation'
    ]
});

//for the week override functionality
Ext.override(Gnt.widget.calendar.WeekEditor, {

    copyDefaultWeekDay: function (index) {
        var result = this.callParent(arguments);
        result.phantom = true;
        return result;
    }

});

//for the week override functionality
Ext.override(Gnt.widget.calendar.CalendarManager, {
	buildTreePanel : function () {
        var me = this;

        return new Ext.tree.Panel(Ext.apply({
            split           : true,
            region          : 'west',
            width           : 200,
            store           : me.calendarManager,
            displayField    : me.calendarManager.model.prototype.nameField,
            rootVisible     : false,
            tbar            : [
                {
                    itemId  : 'btnAdd',
                    text    : me.L('addText'),
                    action  : 'add',
                    iconCls : 'gnt-action-add',
                    handler : me.doAddRootNode,
                    scope   : me
                },
                {
                    itemId  : 'btnRemove',
                    text    : me.L('removeText'),
                    action  : 'remove',
                    iconCls : 'gnt-action-remove',
                    handler : me.doRemoveCalendar,
                    scope   : me
                }
            ],
            viewConfig  : {
               /* plugins     : {
                    ptype               : 'treeviewdragdrop',
                    allowContainerDrops : true,
                    dropZone            : {
                        // we want to always append child node to the hovered one
                        // this behavior isn't supported out of the box by the plugin
                        // so we override a template "onNodeDrop" method
                        onNodeDrop : function (node) {
                            this.valid              = true;
                            this.currentPosition    = 'append';
                            this.overRecord         = this.view.getRecord(node);
                            // call overridden method
                            return this.self.prototype.onNodeDrop.apply(this, arguments);
                        }
                    }
                },*/
                getRowClass : function (record) {
                    if (me.calendarManager.getProjectCalendar() == record.calendar) {
                        return 'gnt-project-calendar-row';
                    }
                },
                listeners   : {
                    drop    : me.onDrop,
                    scope   : me
                }
            },
            listeners   : {
                containercontextmenu    : me.onContainerContextMenu,
                itemcontextmenu         : me.onItemContextMenu,
                selectionchange         : me.onSelectionChange,
                scope                   : me
            }
        }, me.treePanelConfig));
    }
        	
	

});

//attach key navigation to document
/*Ext.getDoc().on('keypress', function(event, target) {
    if (event.ctrlKey && !event.shiftKey) {
        event.stopEvent();

        switch(event.getKey()) {

            case event.LEFT :
                this.shiftTabs(-1);
                break;

            case event.RIGHT :
                this.shiftTabs(1);
                break;

            case event.DELETE :
                this.closeActiveTab();
                break;

            case event.F4 : // this is actually the "S" key
                this.saveAll(); // handler
                break;

            // other cases...
        }
    }
});*/





