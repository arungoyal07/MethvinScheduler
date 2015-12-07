Ext.define("methwin.client.store.TaskStore", {
	extend : 'Gnt.data.TaskStore',
	//rootVisible : false,
	requires : [ 'methwin.client.model.Project' ],
	storeIdProperty : 'crudStoreId',
	crudStoreId : 'tasks',
	model: 'methwin.client.model.Task',
	calendarManager: 'Calendars'
});
