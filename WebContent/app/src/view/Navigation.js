Ext.define("methwin.client.view.Navigation", {
	extend : 'Ext.Container',
	alias : 'widget.navigation',
	layout : 'vbox',
	width : 86,
	weight : 100,
	region : 'west',
	defaultType : 'button',
	cls : 'navigation',
	defaults : {
		enableToggle : true,
		scale : 'large',
		toggleGroup : 'nav',
		height : 64,
		width : 64,
		margin : 10
	},
	items : [ {
		itemId : 'gantt',
		iconCls:'fa fa-tasks fa-3x',
		pressed : true
	}, {
		reference : 'gantttimelinebtn',
		itemId : 'timeline',
		pressed : true,
		iconCls:'fa fa-arrows-h fa-3x'
	} , {
		itemId: 'resourceschedule',
		iconCls:'fa fa-clock-o fa-3x'
	 } , {
		itemId: 'resourcelist',
		iconCls:'fa fa-users fa-3x'
	 } , {
		itemId: 'histogram',
		iconCls:'fa fa-calendar-check-o fa-3x'
	}
	]
});