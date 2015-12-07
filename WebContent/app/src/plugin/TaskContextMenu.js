//extended context menu, color picker added
Ext.define('methwin.client.plugin.TaskContextMenu',
		{
			extend : 'Gnt.plugin.TaskContextMenu',
			mixins : [ 'Gnt.mixin.Localizable' ],
			alias : 'plugin.advanced_taskcontextmenu',

			createMenuItems : function() {
				var items = this.callParent(arguments);
				return [ 
				         /*{
					text : 'Change Task Color',
					requiresTask : true,
					isColorMenu : true,
					menu : {
						showSeparator : false,
						items : [ Ext.create('Ext.ColorPalette', {
							allowReselect : true,
							listeners : {
								select : function(cp, color) {
									this.rec.set('Color', color);
									this.hide();
								},
								scope : this
							}
						}) ]
					}
				}, */
		        {
					handler : this.swapOnTimeline,
					requiresTask : true,
					itemId : 'showintimeline',
					text : 'Show In Timeline'

				} ].concat(items);
			},
			listeners : {
				beforeshow : function() {
					var grid = this.grid;
					taskStore = grid.getTaskStore();
					var taskId = this.rec.getId() || this.rec.internalId;
					if (taskId && taskStore) {
						var task = taskStore.getById(taskId);
						if (task && task.data
								&& task.data.ShowInTimeline === true) {
							this.down('#showintimeline').setText(
									'Remove From Timeline');
						} else {
							this.down('#showintimeline').setText(
									'Show In Timeline');
						}
					}
				}
			},

			swapOnTimeline : function() {
				var grid = this.grid;
				taskStore = grid.getTaskStore();
				var taskId = this.rec.getId() || this.rec.internalId;
				if (taskId && taskStore) {
					var task = taskStore.getById(taskId);
					if (task && task.data) {
						var newValue = !task.data.ShowInTimeline;
						task.set('ShowInTimeline',newValue);
					}
				}
			}
			
			/*,

			configureMenuItems : function() {

				var rec = this.rec;

				// there can be no record when clicked on the empty space in the
				// schedule
				if (!rec)
					return;

				this.callParent(arguments);

				this.down('#addTaskAbove').isValidAction = this.isNotProject;
				this.down('#addTaskBelow').isValidAction = this.isNotProject;
				this.down('#addMilestone').isValidAction = this.isNotProject;

				var colorMenu = this.query('[isColorMenu]')[0].menu.items
						.first(), val = colorMenu.getValue(), recVal = rec
						.get('Color');

				if (colorMenu.el) {
					if (val && recVal && recVal !== val) {

						colorMenu.el.down('a.color-' + val).removeCls(
								colorMenu.selectedCls);

						if (colorMenu.el.down('a.color-' + recVal)) {
							colorMenu.select(recVal.toUpperCase());
						}
					} else if (val && !recVal) {
						colorMenu.el.down('a.color-' + val).removeCls(
								colorMenu.selectedCls);
					}
				}
			}*/
		});
