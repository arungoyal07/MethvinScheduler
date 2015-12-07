Ext.define('Gnt.field.ConstraintDate', {

    extend              : 'Ext.form.field.Date',
    mixins              : ['Gnt.field.mixin.TaskField', 'Gnt.mixin.Localizable'],
    alias               : 'widget.constraintdatefield',

    // This is required to properly handle the field's read only state as designated in task's isEditable() method
    taskField           : 'constraintDateField',
    getTaskValueMethod  : 'getConstraintDate',
    setTaskValueMethod  : 'setConstraintDate',


    valueToVisible : function (value, task) {
        task    = task || this.task;

        var me              = this,
            constraintClass = task.getConstraintClass(),
            format          = me.format || Ext.Date.defaultFormat;

        if (constraintClass) {
            return constraintClass.getDisplayableConstraintDateForFormat(value, format, task);
        } else {
            return value;
        }
    },


    // Called each time when new task is set or current task is updated
    onSetTask : function (task) {
        var me = this;

        me.setValue(me.valueToVisible(me.getTaskValue(task), task));
    },

    setValue : function (value) {
        var me   = this,
            task = me.task;

        me.callParent([ value ]);

        if (!me.getSuppressTaskUpdate() && task && value) {
            me.applyChanges();
        }
    },

    onExpand : function() {
        var me = this,
            value = me.getValue();

        me.getPicker().setValue(Ext.isDate(value) ? value : new Date());
    },

    onSelect : function (picker, pickerDate) {
        // if we display the date with hours, then we (probably) want to keep the task constraint date's hour/minutes
        // after selecting the date from the picker. In the same time picker will clear the time portion
        // so we need to restore it from original date
        // see also: http://www.bryntum.com/forum/viewtopic.php?f=9&t=4294
        var me           = this,
            format       = me.format,
            task         = me.task,
            originalDate = task && me.getTaskValue(task);

        if (originalDate && Ext.Date.formatContainsHourInfo(format)) {
            pickerDate.setHours(originalDate.getHours());
            pickerDate.setMinutes(originalDate.getMinutes());
            pickerDate.setSeconds(originalDate.getSeconds());
        }

        me.callParent([picker, pickerDate]);
    },

    applyChanges : function (task) {
        var me     = this,
            format = me.format || Ext.Date.defaultFormat,
            constraintClass,
            value;

        task            = task || me.task;
        constraintClass = task.getConstraintClass();
        value           = me.getValue();

        if (constraintClass && !Ext.isEmpty(value)) {
            value = constraintClass.adjustConstraintDateFromDisplayableWithFormat(value, format, task);
        }
        else if (Ext.isEmpty(value)) {
            value = null;
        }

        me.setTaskValue(task, value);

        // since we have an "applyChanges" method different from the one provided by "TaskField" mixin
        // we need to fire "taskupdated" ourself
        task.fireEvent('taskupdated', task, me);
    }
});
