Ext.define('methwin.client.view.viewmodel.GanttActionMenuViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.ganttactionmenuviewmodel',

    data: {
        gantt: null,
        crud: null,
        taskStore: null,
        selectedTasks: [],
        fullscreenEnabled: false,
        filterSet: false,
        availableLocales: null,
        currentLocale: null,
        calendarManager: null,
        hasChanges: false
    },

    formulas: {
        hasSelection: function (get) {
            var selected = get('selectedTasks');
            return selected && (selected instanceof Gnt.model.Task || selected.length > 0);
        },

        selectedTask: function (get) {

            if (get('hasSelection')) {
                var selected = get('selectedTasks');
                return selected instanceof Gnt.model.Task ? selected : selected[0];
            }

            return null;
        }
    }

});
