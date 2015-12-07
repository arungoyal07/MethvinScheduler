Ext.define("methwin.client.view.Viewport", {
	extend : 'Ext.Viewport',
	layout : 'border',
    id:'mainviewport',
	data : {
		gantt : null,
		crud : null,
		taskStore : null,
		selectedTasks : [],
		fullscreenEnabled : false,
		filterSet : false,
		availableLocales : null,
		currentLocale : null,
		calendarManager : null,
		hasChanges : false
	},

	requires: [
	           'methwin.client.view.ResourceSchedule',
               'methwin.client.view.ResourceList',
               'methwin.client.view.Gantt',
               'methwin.client.view.ResourceHistogram',
               'methwin.client.model.Resource',
	           'methwin.client.view.Navigation',
			   'methwin.client.view.GanttActionMenu',
			   'methwin.client.view.Timeline',
			   'methwin.client.view.viewcontroller.GanttActionMenuViewController',
			   'methwin.client.view.viewmodel.GanttActionMenuViewModel'
           ],
	viewModel : 'ganttactionmenuviewmodel',
	controller : 'ganttactionmenuviewcontroller',

	initComponent : function() {

	    var calendarManager = new methwin.client.store.Calendars({
	        // we will use BusinessTime calendars
	        //calendarClass: 'Gnt.data.calendar.BusinessTime'
	    });
		this.taskStore = new methwin.client.store.TaskStore({
		    calendarManager: calendarManager
		});
		//debugger;
		var cm = new Gnt.data.CrudManager({
		    autoLoad: true,
            taskStore : this.taskStore,
			autoSync : true,
			autoSyncTimeout : 2000,
			phantomIdField :'PhantomId',
			transport : {
				load : {
					url: 'rest/json/crud/' + ProjectId
				},
				sync : {
					url : 'rest/json/crud/'+ + ProjectId,
					paramName : 'jsonData'
				}
			}
		});

		this.gantt = new methwin.client.view.Gantt({
			id : 'ganttchart',
			crudManager : cm,
			startDate : new Date()
		});

		Ext.apply(this, {
			items : [ {
				xtype : 'navigation',
				id : 'navigation'
			}, {
				xtype : 'container',
				itemId : 'maincontainer',
				region : 'center',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : this.gantt
			}, {
				xtype : 'ganttactionmenu',
				region : 'north'
			}, {
				xtype : 'timeline',
				id : 'gantttimeline',
				region : 'north',
				border : false,
				height : 100,
				padding : '10 0',
				taskStore : this.gantt.crudManager.getTaskStore(),
				split : true
			} ]
		});

		this.callParent(arguments);

		// track CRUD manager changes
		this.mon(this.gantt.crudManager, {
			haschanges : function() {
				this.getViewModel().set('hasChanges', true);
			},
			nochanges : function() {
				this.getViewModel().set('hasChanges', false);
			},
			scope : this
		});
		
		
	}
});