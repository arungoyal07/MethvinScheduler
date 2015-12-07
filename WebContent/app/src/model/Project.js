Ext.define('methwin.client.model.Project', {
	extend : 'Gnt.model.Project',

	fields : [ {
		name : 'index',
		type : 'int',
		persist : true
	}, {
		name : 'expanded',
		type : 'bool',
		persist : true
	}, {
		name : 'Color',
		type : 'string'
	}, {
		name : 'ShowInTimeline',
		type : 'bool'
	}, {
		name : 'PhantomId',
		type : 'string'
	} ],
	showInTimelineField : 'ShowInTimeline'
});
