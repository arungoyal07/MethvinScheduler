Ext.define('methwin.client.locale.En', {
    extend    : 'Sch.locale.Locale',
    requires  : 'Gnt.locale.En',
    singleton : true,

    l10n : {
        'methwin.client.Application' : {
            error           : 'Error',
            requestError    : 'Request error'
        },

        'methwin.client.view.Timeline' : {
            start   : 'Start',
            end     : 'End'
        },

        'methwin.client.column.ShowInTimeline' : {
            text : 'Show in timeline'
        },

        'methwin.client.view.GanttActionMenu' : {
            previousTimespan        : 'Previous timespan',
            nextTimespan            : 'Next timespan',
            collapseAll             : 'Collapse all',
            expandAll               : 'Expand all',
            zoomOut                 : 'Zoom out',
            zoomIn                  : 'Zoom in',
            zoomToFit               : 'Zoom to fit',
            viewFullScreen          : 'View full screen',
            highlightCriticalPath   : 'Highlight critical path',
            addNewTask              : 'Add new task',
            newTask                 : 'New Task',
            removeSelectedTasks     : 'Remove selected task(s)',
            indent                  : 'Indent',
            outdent                 : 'Outdent',
            manageCalendars         : 'Manage calendars',
            saveChanges             : 'Save changes',
            language                : 'Language: ',
            selectLanguage          : 'Select a language...',
            tryMore                 : 'Try more features...'
        }
        /*,

        'methwin.client.plugin.TaskContextMenu' : {
            changeTaskColor         : 'Change task color'
        },

        'methwin.client.view.GanttSecondaryToolbar' : {
            toggleChildTasksGrouping        : 'Toggle child tasks grouping on/off',
            toggleRollupTasks               : 'Toggle rollup tasks',
            highlightTasksLonger8           : 'Highlight tasks longer than 8 days',
            filterTasksWithProgressLess30   : 'Filter: Tasks with progress < 30%',
            clearFilter                     : 'Clear Filter',
            scrollToLastTask                : 'Scroll to last task'
        }*/

    }

});
