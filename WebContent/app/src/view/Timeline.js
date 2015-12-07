Ext.define("methwin.client.view.Timeline", {
    extend          : 'Ext.Container',

    requires        : [
        'Ext.form.field.Display',
        'methwin.client.view.TimelineScheduler'
    ],

    mixins          : ['Gnt.mixin.Localizable'],
    alias           : 'widget.timeline',

    layout          : {
        type  : 'hbox',
        align : 'stretch'
    },

    height          : 100,
    labelWidth      : 100,

    taskStore       : null,
    scheduler       : null,
    schedulerClass  : 'methwin.client.view.TimelineScheduler',

    initComponent : function () {
        this.addCls('sch-gantt-timeline');

        this.scheduler  = this.buildScheduler();

        this.scheduler.on('viewchange', this.onTimespanChange, this);

        this.items      = this.buildItems();

        this.callParent(arguments);
    },


    buildScheduler : function () {
        return Ext.create(this.schedulerClass, {
            taskStore : this.taskStore,
            flex      : 1
        });
    },


    buildItems : function () {
        return [
            {
                xtype       : 'displayfield',
                fieldLabel  : 'start',//this.L('start'),
                labelAlign  : 'top',
                itemId      : 'startlabel',
                cls         : 'sch-gantt-timeline-label sch-gantt-timeline-left-label',
                width       : this.labelWidth
            },
            this.scheduler,
            {
                xtype       : 'displayfield',
                fieldLabel  : 'end',//this.L('end'),
                labelAlign  : 'top',
                itemId      : 'endlabel',
                cls         : 'sch-gantt-timeline-label sch-gantt-timeline-right-label',
                width       : this.labelWidth
            }
        ];
    },

    getStartLabel : function () {
        return this.startLabel || (this.startLabel = this.down('#startlabel'));
    },

    getEndLabel : function () {
        return this.endLabel || (this.endLabel = this.down('#endlabel'));
    },

    onTimespanChange : function () {
        var start   = this.scheduler.getStart();
        var end     = this.scheduler.getEnd();

        this.getStartLabel().setValue(Ext.Date.format(start, Ext.Date.defaultFormat));
        this.getEndLabel().setValue(Ext.Date.format(end, Ext.Date.defaultFormat));
    }
});
