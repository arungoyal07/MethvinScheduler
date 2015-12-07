Ext.define('methwin.client.view.GanttActionMenu', {
	extend : 'Ext.Toolbar',
	alias : 'widget.ganttactionmenu',
	mixins : [ 'Gnt.mixin.Localizable' ],
	cls : 'gantt-primary-toolbar',
	defaults : {
		scale : 'medium',
		margin : '0 3 0 3'
	},
	initComponent : function() {

		this.items = [ {
			tooltip : 'Previous timespan',
			reference : 'shiftPrevious',
			html : '<i class="fa fa-angle-double-left fa-3x"></i>'
		}, {
			tooltip : 'next Timespan',
			reference : 'shiftNext',
			html : '<i class="fa fa-angle-double-right fa-3x"></i>'
		}, {
			// text:'collapse',
			tooltip : 'collapse All',
			reference : 'collapseAll',
			html : '<i class="fa fa-angle-double-up fa-3x"></i>'
		}, {
			// text:'expand',
			tooltip : 'expand All',
			reference : 'expandAll',
			html : '<i class="fa fa-angle-double-down fa-3x"></i>'
		}, {
			tooltip : 'zoom Out',
			reference : 'zoomOut',
			html : '<i class="fa fa-search-minus fa-2x"></i>'
		}, {
			// text:'zoomin',
			tooltip : 'zoom In',
			reference : 'zoomIn',
			html : '<i class="fa fa-search-plus fa-2x"></i>'
		}, {
			// text:'zoom to fit',
			tooltip : 'zoom To Fit',
			reference : 'zoomToFit',
			html : '<i class="fa fa-expand fa-2x"></i>'
		},
		/*
		 * { //text:'full screen', tooltip: 'view Full Screen', reference:
		 * 'viewFullScreen', glyph: 0xE806 },
		 */
		{
			tooltip : 'highlight Critical Path',
			reference : 'criticalPath',
			html : '<i class="fa fa-fire fa-2x" style="color:red"></i>',
			enableToggle : true
		}, {
			// text:'add new tasks',
			tooltip : 'add New Task',
			reference : 'addTask',
			html : '<i class="fa fa-plus top-nav-icon-md"></i>'
		}, {
			tooltip : 'remove Selected Tasks',
			reference : 'removeSelected',
			html : '<i class="fa fa-remove top-nav-icon-lg"></i>',
			bind : {
				disabled : '{!hasSelection}'
			}
		}, {
			// text:'indent',
			tooltip : 'indent',
			reference : 'indentTask',
			html : '<i class="fa fa-indent  top-nav-icon-md"></i>',
			bind : {
				disabled : '{!hasSelection}'
			}
		}, {
			// text:'otdent',
			tooltip : 'outdent',
			reference : 'outdentTask',
			html : '<i class="fa fa-outdent  top-nav-icon-md"></i>',
			bind : {
				disabled : '{!hasSelection}'
			}
		}, {
			// text: 'manageCalendars',
			tooltip : 'manageCalendars',
			reference : 'manageCalendars',
			html : '<i class="fa fa-calendar fa-2x"></i>',
			bind : {
				hidden : '{!calendarManager}'
			}
		},  {
			tooltip : 'Cut',
			reference : 'cutButton',
			html:'<i class="fa fa-cut top-nav-icon-sm"></i>',
			bind:{
				hidden:'{!hasSelection}'
			}
		}, {
			tooltip : 'Copy',
			reference:'copyButton',
			//reference : 'saveChanges',
			html:'<i class="fa fa-copy top-nav-icon-sm"></i>'
		}, {
			tooltip : 'Paste',
			reference : 'pasteSelection',
			html:'<i class="fa fa-paste top-nav-icon-sm"></i>'
		},{
			tooltip : 'Bold',
			reference:'boldButton',
			html:'<i class="fa fa-bold top-nav-icon-sm"></i>',
			bind : {
				disabled : '{!hasSelection}'
			}
		},{
			tooltip : 'Italic',
			reference : 'italicButton',
			html:'<i class="fa fa-italic top-nav-icon-sm"></i>',
			bind : {
				disabled : '{!hasSelection}'
			}
		},{
			tooltip : 'Underline',
			reference : 'underlineButton',
			html:'<i class="fa fa-underline top-nav-icon-sm"></i>',
			bind : {
				disabled : '{!hasSelection}'
			}
		}, {
			tooltip : 'Strikethrough',
			reference : 'strikeButton',
			html:'<i class="fa fa-strikethrough top-nav-icon-sm"></i>',
			bind : {
				disabled : '{!hasSelection}'
			}
		}, {
			tooltip : 'Font Color',
			//reference : 'saveChanges',
			html:'<i class="fa fa-font top-nav-icon-sm"></i>',

			xtype: 'splitbutton',
			menu : {
				showSeparator: false,
				items: [
				        Ext.create('Ext.ColorPalette', {
				        	listeners: {
				        		select: function(cp, color){
				        			var currentColorCss = 'color-'+ color;
				        			var gantt = Ext.getCmp('mainviewport').gantt;
				        			var selection = gantt.getSelectionModel().getSelection();
				        			if (selection) {
				        				for (var i = 0; i < selection.length; i++) {
				        					var task = selection[i];
				        					var currentCss = task.getCls();
				        					var newCss = '';
				        					if(currentCss !== ''){
				        						if (currentCss.indexOf('color-') > -1) {
				        							var indexOfColor = currentCss.indexOf('color-');
				        							newCss = currentCss.substring(0, indexOfColor) 
				        							+ currentColorCss + currentCss.substring(indexOfColor +12);

				        						}
				        						else {
				        							newCss = currentCss + ' ' + currentColorCss;

				        						}
				        					}
				        					else
				        					{
				        						newCss =currentColorCss;
				        					}
				        					task.setCls(newCss);
				        				}
				        				//Ext.WindowManager.getActive().close();
				        			}
				        			
				        		}
				        		
				        	}
				        })


				        ]
			},
			bind : {
				disabled : '{!hasSelection}'
			}

		}, {
			tooltip : 'Erase Style',
			reference : 'eraseButton',
			html:'<i class="fa fa-eraser top-nav-icon-sm"></i>',
			bind : {
				disabled : '{!hasSelection}'
			}
		}, ];

		this.callParent(arguments);
	}
});
