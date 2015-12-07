Ext
		.define(
				"methwin.client.view.ResourceList",
				{
					extend : 'Ext.grid.Panel',
					alias : 'widget.resourcelist',
					title : 'RESOURCES',
					flex : 1,
					hidden : true,
					bodyCls : 'resourcelist',
					columnLines : true,
					plugins : [ new Ext.grid.plugin.CellEditing({}) ],
					columns : [
							{
								text : 'Name',
								flex : 1,
								dataIndex : 'Name',
								editor : {
									xtype : 'textfield'
								}
							},
							{
								text : 'Calendar',
								flex : 2,
								dataIndex : 'CalendarId',
								renderer : function(value) {
									if (!isNaN(value)) {
										return Ext.getCmp('mainviewport').gantt.taskStore.calendarManager
												.getCalendar(value).name;
									} else {
										return '';
									}

								},
								editor : {
									xtype : 'calendarfield',
									displayField : 'Name'
								}
							} ],
					dockedItems : [ {
						xtype : 'toolbar',
						dock : 'top',
						ui : 'footer',
						align : 'left',
						items : [ {
							xtype : 'button',
							align : 'left',
							text : 'add resource',
							handler : function() {
				                   Ext.getCmp('mainviewport').gantt.taskStore.resourceStore.add({});
							}
						} ],
					} ]
				});