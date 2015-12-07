Ext.define('methwin.client.view.viewcontroller.GanttActionMenuViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ganttactionmenuviewcontroller',

    requires: ['Gnt.widget.calendar.CalendarManagerWindow'],

    control: {
        '#': { afterrender: 'onAfterRender' },
        'button[reference=gantttimelinebtn]': { click: 'onTimelineClick' },
        'button[reference=shiftPrevious]': { click: 'onShiftPrevious' },
        'button[reference=shiftNext]': { click: 'onShiftNext' },
        'button[reference=collapseAll]': { click: 'onCollapseAll' },
        'button[reference=expandAll]': { click: 'onExpandAll' },
        'button[reference=zoomOut]': { click: 'onZoomOut' },
        'button[reference=zoomIn]': { click: 'onZoomIn' },
        'button[reference=zoomToFit]': { click: 'onZoomToFit' },
        'button[reference=viewFullScreen]': { click: 'onFullScreen' },
        'button[reference=criticalPath]': { click: 'onHighlightCriticlaPath' },
        'button[reference=addTask]': { click: 'onAddTask' },
        'button[reference=removeSelected]': { click: 'onRemoveSelectedTasks' },
        'button[reference=indentTask]': { click: 'onIndent' },
        'button[reference=outdentTask]': { click: 'onOutdent' },
        'button[reference=manageCalendars]': { click: 'onManageCalendars' },
        'button[reference=saveChanges]': { click: 'onSaveChanges' },
        'button[reference=pasteSelection]': { click: 'onPasteSelection' },
        'button[reference=boldButton]': { click: 'onBoldSelection' },
        'button[reference=italicButton]': { click: 'onItalicSelection' },
        'button[reference=underlineButton]': { click: 'onUnderlineSelection' },
        'button[reference=strikeButton]': { click: 'onStrikethroughSelection' },
        'button[reference=eraseButton]': { click: 'onClearStylesSelection'},
        'button[reference=cutButton]':{click:'onCutSelection'},
        'button[reference=copyButton]':{click:'onCopySelection'},
        
    },

    getGantt: function () {
        return this.getView().gantt;
    },

    onShiftPrevious: function () {
        this.getGantt().shiftPrevious();
    },

    onShiftNext: function () {
        this.getGantt().shiftNext();
    },

    onCollapseAll: function () {
        this.getGantt().collapseAll();
    },

    onExpandAll: function () {
        this.getGantt().expandAll();
    },

    onZoomOut: function () {
        this.getGantt().zoomOut();
    },

    onZoomIn: function () {
        this.getGantt().zoomIn();
    },

    onZoomToFit: function () {
        this.getGantt().zoomToFit(null, { leftMargin: 100, rightMargin: 100 });
    },

    onFullScreen: function () {
        this.getGantt().getEl().down('.x-panel-body').dom[this.getFullscreenFn()](Element.ALLOW_KEYBOARD_INPUT);
    },

    // Experimental, not X-browser
    getFullscreenFn: function () {
        var docElm = document.documentElement,
            fn;

        if (docElm.requestFullscreen) {
            fn = "requestFullscreen";
        }
        else if (docElm.mozRequestFullScreen) {
            fn = "mozRequestFullScreen";
        }
        else if (docElm.webkitRequestFullScreen) {
            fn = "webkitRequestFullScreen";
        }
        else if (docElm.msRequestFullscreen) {
            fn = "msRequestFullscreen";
        }

        return fn;
    },

    onHighlightCriticlaPath: function (btn) {
        var v = this.getGantt().getSchedulingView();
        if (btn.pressed) {
            v.highlightCriticalPaths(true);
        } else {
            v.unhighlightCriticalPaths(true);
        }
    },

    onAddTask: function () {
        var gantt = this.getGantt(),
            record,
            viewModel = this.getViewModel(),
            selectedTask = viewModel.get('selectedTask');



        if (selectedTask) {

            record = selectedTask.appendChild({
                Name: 'New Task',
                leaf: true
            });
        }
        else {

            record = gantt.getTaskStore().getRoot().appendChild({
                Name: 'New Project',
                TaskType: "methwin.client.model.Project",
                leaf: true
            });
        }

        // gantt.getSchedulingView().scrollEventIntoView(record);

        // gantt.lockedGrid.getPlugin('editingInterface').startEdit(record, 1);
    },

    onRemoveSelectedTasks: function () {
        // var selected = this.getViewModel().get('selectedTasks');

        var selected = this.getGantt().getSelectionModel().getSelection();


        Ext.Array.forEach([].concat(selected), function (task) {
            task.remove();
        });
    },

    onIndent: function () {
        var gantt = this.getGantt(),
            selected = this.getGantt().getSelectionModel().getSelection();

        gantt.getTaskStore().indent([].concat(selected));
    },

    onOutdent: function () {
        var gantt = this.getGantt(),
            selected = this.getGantt().getSelectionModel().getSelection();

        gantt.getTaskStore().outdent([].concat(selected));
    },

    onSaveChanges: function () {
        this.getGantt().crudManager.sync();
    },
    
    onManageCalendars: function () {
        var gantt = this.getGantt();

        this.calendarsWindow = new Gnt.widget.calendar.CalendarManagerWindow({
            calendarManager: gantt.getTaskStore().calendarManager,
            modal: true
        });

        this.calendarsWindow.show();
    },
    
    onBoldSelection:function(){
    	this.onSwapSelectionClass('tsk-b');
    },
    
    onItalicSelection:function(){
    	this.onSwapSelectionClass('tsk-i');
    },
    
    onUnderlineSelection:function(){
    	this.onSwapSelectionClass('tsk-u');
    },
    
    onStrikethroughSelection:function(){
    	this.onSwapSelectionClass('tsk-strk');
    },
    
    onClearStylesSelection:function(){
    	var gantt=this.getGantt();
    	var selection=gantt.getSelectionModel().getSelection();
    	if(selection){			
			var selectionLength=selection.length;
			for(var i=0;i<selectionLength;i++)
			{
				var task=selection[i];
				task.setCls('');
				
			}
		}
    },
    
    onSwapSelectionClass:function(className){
    	var gantt=this.getGantt();
    	var selection=gantt.getSelectionModel().getSelection();
    	if(selection && selection.length==1){
			var task=selection[0];
			if(task.getCls().indexOf(className)>=0)
			{
				task.setCls(this.removeClass(task.getCls(),className));
			}
			else
			{
				task.setCls(this.addClass(task.getCls(),className));
			}
		}
		else if(selection && selection.length>1)
		{
			var firstOccurance=selection[0].getCls().indexOf(className)>=0;
			var isDifferentFont=false;
			var selectionLength=selection.length;
			for(var i=1;i<selectionLength;i++){
				if(firstOccurance!=(selection[i].getCls().indexOf(className)>=0)){
					isDifferentFont=true;
				}
			}
			if(isDifferentFont | firstOccurance){
    			for(var i=0;i<selectionLength;i++){
    				var task=selection[i];
    				task.setCls(this.removeClass(task.getCls(),className));
    			}
			}
			else
			{
    			for(var i=0;i<selectionLength;i++){
    				var task=selection[i];
    				task.setCls(this.addClass(task.getCls(),className));
    			}    				
			}
		}
    },
    
    removeClass:function(sourceString,className){
    	if(sourceString && className){
    		var endsRemovalRegex=new RegExp('^'+className+'$|^ '+className+'| '+className+'$','g');
    		var centerRemovalRegex=new RegExp(' '+className+' ','g');
    		return sourceString.replace(endsRemovalRegex,'').replace(centerRemovalRegex,' ');
    	}
    	return sourceString;
    },
    
    addClass:function(sourceString,className){
    	if(className){
	    	if(sourceString){
	    		this.removeClass(sourceString,className);
	    		return sourceString+' '+className;
	    	}
	    	else{
	    		return className;
	    	}
    	}
    	else{
    		return sourceString;;
    	}
    },
    
    onCutSelection:function(){
    	this.moveOperation='cut';
    	this.identifyMoveParents();
    },
    
    onCopySelection:function(){
    	this.moveOperation='copy';
    	this.identifyMoveParents();
    },
    
    identifyMoveParents:function(){
    	this.moveIds=[];
		var allIds=[];
		var gantt=this.getGantt();
		var selection=this.getGantt().getSelectionModel().getSelection();
		if(selection){
			for(var index in selection){
				var task=selection[index];
				allIds.push(task.getId());
			}

			for(var index in selection){
				var task=selection[index];
				if(allIds.indexOf(task.parentNode.getId())<0){
					this.moveIds.push(task.getId());
				}
			}
		}    	
    },
    
    onPasteSelection:function(){
    	if(this.moveOperation && this.moveIds){
    		
    		var gantt=this.getGantt();
    		var selection=this.getGantt().getSelectionModel().getSelection();
    		
    		if(!selection || selection.length>1){
    			Ext.MessageBox.show({
    				title:'Error!',
    				msg:'Please select exacly one row to paste',
    				buttons:Ext.Msg.OK
    			});
    			return;
    		}
    		
    		var destTask=selection[0];
    		var enumerator=destTask;
    		while(enumerator!=null){
    			if(this.moveIds.indexOf(enumerator.getId())>=0){
    				Ext.MessageBox.show({
        				title:'Error!',
        				msg:'You cannot paste under any of the selected task.',
        				buttons:Ext.Msg.OK
        			});
        			return;
    			}
    			enumerator=enumerator.parentNode;
    		}
    		
    		
    		if(this.moveOperation=='cut'){
    			for(var index in this.moveIds){
    				var sourceTask=gantt.taskStore.getById(this.moveIds[index]);
    				if(sourceTask!=null){
    					destTask.appendChild(sourceTask);
    				}
    			}
    		}
    		
    		if(this.moveOperation=='copy'){
    			var sourceArray=[];
    			for(var index in this.moveIds){
    				var sourceTask=gantt.taskStore.getById(this.moveIds[index]);
    				if(sourceTask!=null){
    					this.recursiveCopy(destTask,[sourceTask])
    				}
    			}
    			
    		}
    		
    		if(this.moveOperation=='cut' || this.moveOperation=='copy'){
    			this.moveOperation=null;
    		}
    		
    	}
    },
    
    recursiveCopy:function(destTask,sourceArray){
    	var destArr=[];
    	sourceArray =  sourceArray.length>1?Ext.Array.sort(sourceArray,function(a,b){return a.getIndex()>b.getIndex();}):sourceArray;
    	for(var index in sourceArray){
    		var sourceTask=sourceArray[index];
    		var sourceCopy=this.getTaskCopy(sourceTask);
    		destTask.appendChild(sourceCopy);
    		if(sourceTask.childNodes.length>0){
    			this.recursiveCopy(destTask.lastChild,sourceTask.childNodes);
    		}
    	}
    },
    
    getTaskCopy:function(src){
    	return {
    		leaf:src.isLeaf(),
    		expanded:src.isExpanded(),
    		Name:src.getName(),
    		Effort:src.getEffort(),
    		StartDate:src.getStartDate(),
    		EndDate:src.getEndDate(),
    		//ShowInTimeline:src.getShowInTimeline(),
    		Cls:src.getCls(),
    		Duration:src.getDuration(),
    		DurationUnit:src.getDurationUnit(),
    		EffortUnit:src.getEffortUnit(),
    		CalendarId:src.getCalendarId(),
    		PercentDone:src.getPercentDone(),
    		ConstraintType:src.getConstraintType(),
    		ConstraintDate:src.getConstraintDate(),
    		BaselineStartDate:src.getBaselineStartDate(),
    		BaselineEndDate:src.getBaselineEndDate(),
    		BaselinePercentDone:src.getBaselinePercentDone(),
    		Rollup:src.getRollup()
    		
    	}
    },

    onAfterRender: function () {
        var me = this,
         viewModel = me.getViewModel();

        viewModel.data.taskStore = this.getGantt().crudManager.getTaskStore();
        viewModel.data.calendarManager = this.getGantt().crudManager.calendarManager;
        // TODO: unable to get this to work
        // viewModel.set('fullscreenEnabled', !!this.getFullscreenFn());
        // me.mon(taskStore, 'filter-set', function () {
        // viewModel.set('filterSet', true);
        // });
        // me.mon(taskStore, 'filter-clear', function () {
        // viewModel.set('filterSet', false);
        // });
    },

    onTimelineClick: function () {
        var timelineComponent = Ext.getCmp('gantttimeline');
        timelineComponent.setVisible(!timelineComponent.isVisible());
    }
});
