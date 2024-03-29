/**

 @class Gnt.data.TaskStore
 @extends Ext.data.TreeStore

 A class representing the tree of tasks in the gantt chart. An individual task is represented as an instance of the {@link Gnt.model.Task} class. The store
 expects the data loaded to be hierarchical. Each parent node should contain its children in a property called 'children' (please note that this is different from the old 1.x
 version where the task store expected a flat data structure)

 Parent tasks
 ------------

 By default, when the start or end date of a task gets changed, its parent task(s) will optionally also be updated. Parent tasks always start at it earliest child and ends
 at the end date of its latest child. So be prepared to see several updates and possibly several requests to server. You can batch them with the {@link Ext.data.proxy.Proxy#batchActions} configuration
 option.

 Overall, this behavior can be controlled with the {@link #recalculateParents} configuration option (defaults to true).

 Cascading
 ---------

 In the similar way, when the start/end date of the task gets changed, gantt *can* update any dependent tasks, so they will start on the earliest date possible.
 This behavior is called "cascading" and is enabled or disabled using the {@link #cascadeChanges} configuration option.

 Integration notes
 ---------

 For details on data integration - please see [this guide](../#!/guide/gantt_data_integration).

 */
Ext.define('Gnt.data.TaskStore', {
    extend                  : 'Ext.data.TreeStore',

    requires                : [
        'Sch.util.Date',
        'Sch.patches.TreeStore',
        'Gnt.data.Linearizator',
        'Gnt.data.util.IdConsistencyManager',
        'Gnt.data.util.ModelPersistencyManager',
        'Gnt.model.Task',
        'Gnt.model.Project',
        'Gnt.data.Calendar',
        'Gnt.data.DependencyStore' // TODO: why do we depend only on Dependency store and not in Resource/Assignments stores as well?
    ],

    mixins                  : [
        'Gnt.patches.TaskStore',
        'Sch.data.mixin.FilterableTreeStore',
        'Sch.data.mixin.UniversalModelGetter',
        'Sch.data.mixin.CacheHintHelper',
        'Sch.data.mixin.EventStore',
        'Gnt.data.mixin.ProjectableStore'
    ],

    model                   : 'Gnt.model.Task',

    alias                   : 'store.gantt_taskstore',

    storeId                 : 'tasks',
    proxy                   : 'memory',

    /**
     * @cfg {String} typeProperty
     * The name of the property in a raw task data block which indicates the type of the task to be created from that raw data.
     * This is used for heterogeneous trees containing both task and project models (the value is set on the `typeProperty` of the DataReader).
     * For example, the data may look like this:
     *
     *      [{
     *          // TaskType provided so Gnt.model.Project instance will be created for the node
     *          TaskType    : 'Gnt.model.Project',
     *          Name        : 'Main Project',
     *          StartDate   : '2015-06-01',
     *          Duration    : 100,
     *          children    : [{
     *              // since TaskType is omitted the store model will be used for the node
     *              Name        : 'Task 1',
     *              StartDate   : '2015-06-01',
     *              Duration    : 10
     *              children    : [{
     *                  // since TaskType is omitted the store model will be used for the node
     *                  Name        : 'Sub-task 1'
     *                  StartDate   : '2015-06-01',
     *                  Duration    : 10,
     *                  leaf        : true
     *              }]
     *          }]
     *      }]
     *
     * The values should correspond to a valid {@link Gnt.model.Task Task} model class.
     */
    typeProperty            : 'TaskType',

    /**
     * @cfg {Gnt.data.CalendarManager} calendarManager A calendar manager instance.
     * If specified then the task store will use its {@link Gnt.data.Calendar project calendar}.
     */
    calendarManager         : null,

    /**
     * @cfg {Gnt.data.Calendar} calendar A {@link Gnt.data.Calendar calendar} instance to use for this task store. **Should be loaded prior the task store**.
     * This option can be also specified as the configuration option for the gantt panel. If not provided, a default calendar, containig the weekends
     * only (no holidays) will be created.
     *
     */
    calendar                : null,

    /**
     * @cfg {Gnt.data.DependencyStore} dependencyStore A `Gnt.data.DependencyStore` instance with dependencies information.
     * This option can be also specified as a configuration option for the gantt panel.
     */
    dependencyStore         : null,


    /**
     * @cfg {Gnt.data.ResourceStore} resourceStore A `Gnt.data.ResourceStore` instance with resources information.
     * This option can be also specified as a configuration option for the gantt panel.
     */
    resourceStore           : null,

    /**
     * @cfg {Gnt.data.AssignmentStore} assignmentStore A `Gnt.data.AssignmentStore` instance with assignments information.
     * This option can be also specified as a configuration option for the gantt panel.
     */
    assignmentStore         : null,

    /**
     * @cfg {Boolean} weekendsAreWorkdays This option will be translated to the {@link Gnt.data.Calendar#weekendsAreWorkdays corresponding option} of the calendar.
     *
     */
    weekendsAreWorkdays     : false,

    /**
     * @cfg {Boolean} cascadeChanges A boolean flag indicating whether a change in some task should be propagated to its depended tasks. Defaults to `false`.
     * This option can be also specified as the configuration option for the gantt panel.
     */
    cascadeChanges          : true,

    /**
     * @cfg {Boolean} batchSync true to batch sync request for 500ms allowing cascade operations, or any other task change with side effects to be batched into one sync call. Defaults to true.
     */
    batchSync               : true,

    /**
     * @cfg {Boolean} recalculateParents A boolean flag indicating whether a change in some task should update its parent task. Defaults to `true`.
     * This option can be also specified as the configuration option for the gantt panel.
     */
    recalculateParents      : true,

    /**
     * @cfg {Boolean} skipWeekendsDuringDragDrop A boolean flag indicating whether a task should be moved to the next earliest available time if it falls on non-working time,
     * during move/resize/create operations. Defaults to `true`.
     * This option can be also specified as a configuration option for the Gantt panel.
     */
    skipWeekendsDuringDragDrop  : true,

    /**
     * @cfg {Number} cascadeDelay If you usually have deeply nested dependencies, it might be a good idea to add a small delay
     * to allow the modified record to be refreshed in the UI right away and then handle the cascading
     */
    cascadeDelay                : 0,

    /**
     * @cfg {Boolean} moveParentAsGroup Set to `true` to move parent task together with its children, as a group. Set to `false`
     * to move only parent task itself. Note, that to enable drag and drop for parent tasks, one need to use the
     * {@link Gnt.panel.Gantt#allowParentTaskMove} option.
     */
    moveParentAsGroup           : true,

    /**
     * @cfg {Boolean} enableDependenciesForParentTasks Set to `true` to process the dependencies from/to parent tasks as any other dependency.
     * Set to `false` to ignore such dependencies and not cascade changes by them.
     *
     * Currently, support for dependencies from/to parent task is limited. Only the "start-to-end" and "start-to-start" dependencies
     * are supported. Also, if some task has incoming dependency from usual task and parent task, sometimes the dependency from
     * parent task can be ignored.
     *
     * Note, that when enabling this option requires the {@link Gnt.data.DependencyStore#strictDependencyValidation} to be set to `true` as well.
     * Otherwise it will be possible to create indirect cyclic dependnecies, which will cause "infinite recursion" exception.
     */
    enableDependenciesForParentTasks : true,

    /**
     * @cfg {Number} availabilitySearchLimit Maximum number of days to search for calendars common availability.
     * Used in various task calculations requiring to respect working time.
     * In these cases system tries to account working time as intersection of assigned resources calendars and task calendar.
     * This config determine a range intersectin will be searched in.
     * For example in case of task end date calculation system will try to find calendars intersection between task start date
     * and task start date plus `availabilitySearchLimit` days.
     */
    availabilitySearchLimit     : 1825, //5*365

    /**
     * @cfg {String} [cycleResolutionStrategy='cut'] Strategy to use to resolve cycles in dependent node sets.
     * Possible values are:
     * - "none"
     * - "exception"
     * - "cut"
     * Each value corresponds to a public function from (@link Gnt.data.linearizator.CycleResolvers}.
     */
    cycleResolutionStrategy     : 'cut',
    /**
     * @cfg {Boolean} [autoNormalizeNodes=true] Flag defining whether to automaticaly normalize nodes by calculating
     *  derivative data fields.
     */
    autoNormalizeNodes : true,

    /**
     * @event filter
     * Will be fired on the call to `filter` method
     * @param {Gnt.data.TaskStore} self This task store
     * @param {Object} args The arguments passed to `filter` method
     */

    /**
     * @event clearfilter
     * Will be fired on the call to `clearFilter` method
     * @param {Gnt.data.TaskStore} self This task store
     * @param {Object} args The arguments passed to `clearFilter` method
     */

    /**
    * @event beforecascade
    * Fires before a cascade operation is initiated
    * @param {Gnt.data.TaskStore} store The task store
    */

    /**
    * @event cascade
    * Fires when after a cascade operation has completed
    * @param {Gnt.data.TaskStore} store The task store
    * @param {Object} context A context object revealing details of the cascade operation, such as 'nbrAffected' - how many tasks were affected.
    */

    cascading                   : false,
    isFillingRoot               : false,
    isSettingRoot               : false,

    earlyStartDates             : null,
    earlyEndDates               : null,
    lateStartDates              : null,
    lateEndDates                : null,

    lastTotalTimeSpan           : null,

    suspendAutoRecalculateParents : 0,
    suspendAutoCascade            : 0,

    currentCascadeBatch         : null,
    batchCascadeLevel           : 0,


    fillTasksWithDepInfoCounter : 0,

    /**
     * @cfg {String} dependenciesCalendar A string, defining the calendar, that will be used when calculating the working time, skipped
     * by the dependencies {@link Gnt.model.Dependency#lagField lag}. Default value is `project` meaning main project calendar is used.
     * Other recognized values are: `source` - the calendar of dependency's source task is used, `target` - the calendar of target task.
     */
    dependenciesCalendar        : 'project',

    pendingDataUpdates          : null,

    /**
     * Will be fired on the call to `filter` method
     * @event filter
     * @param {Gnt.data.TaskStore} self This task store
     * @param {Object} args The arguments passed to `filter` method
     */

    /**
     * Will be fired on the call to `clearFilter` method
     * @event clearfilter
     * @param {Gnt.data.TaskStore} self This task store
     * @param {Object} args The arguments passed to `clearFilter` method
     */

    /**
     * @event beforecascade
     * Fires before a cascade operation is initiated
     * @param {Gnt.data.TaskStore} store The task store
     */

    /**
     * @event cascade
     * Fires when after a cascade operation has completed
     * @param {Gnt.data.TaskStore} store The task store
     * @param {Object} context A context object revealing details of the cascade operation, such as 'nbrAffected' - how many tasks were affected.
     */

    constructor : function (config) {
        config      = config || {};

        var calendar = config.calendar || this.calendar;

        if (!calendar) {

            var calendarConfig  = {};

            if (config.hasOwnProperty('weekendsAreWorkdays')) {
                calendarConfig.weekendsAreWorkdays = config.weekendsAreWorkdays;
            } else {
                if (this.self.prototype.hasOwnProperty('weekendsAreWorkdays') && this.self != Gnt.data.TaskStore) {
                    calendarConfig.weekendsAreWorkdays = this.weekendsAreWorkdays;
                }
            }

            var calendarManager = config.calendarManager || this.calendarManager;

            // if we have calendarManager specified
            if (calendarManager) {

                var me              = this;

                calendarManager = config.calendarManager = Ext.data.StoreManager.lookup(calendarManager);

                var projectCalendar = calendarManager.getProjectCalendar();

                if (projectCalendar) {
                    calendar        = projectCalendar;
                } else {
                    // wait till calendar manager set a project calendar and then use it
                    this.calendarManagerListeners   = calendarManager.on({
                        projectcalendarset  : function (manager, calendar) {
                            me.setCalendar(calendar, true);
                        },

                        destroyable         : true,
                        single              : true
                    });
                }
            }

            calendar = calendar && Ext.data.StoreManager.lookup(calendar) || new Gnt.data.Calendar(calendarConfig);
        }


        // If not provided, create default stores (which will be overridden by GanttPanel during instantiation

        var dependencyStore = config.dependencyStore || this.dependencyStore;
        dependencyStore = dependencyStore && Ext.data.StoreManager.lookup(dependencyStore) || Ext.create("Gnt.data.DependencyStore");
        delete config.dependencyStore;

        var resourceStore = config.resourceStore || this.resourceStore;
        resourceStore = resourceStore && Ext.data.StoreManager.lookup(resourceStore) || Ext.create("Gnt.data.ResourceStore");
        delete config.resourceStore;

        var assignmentStore = config.assignmentStore || this.assignmentStore;
        assignmentStore = assignmentStore && Ext.data.StoreManager.lookup(assignmentStore) || Ext.create("Gnt.data.AssignmentStore", {resourceStore : resourceStore});
        delete config.assignmentStore;

        if (calendar) {
            delete config.calendar;

            this.setCalendar(calendar, true, true);
        }

        // init cache for early/late dates
        this.resetEarlyDates(true);
        this.resetLateDates(true);

        this.pendingDataUpdates = {
            recalculateParents : {}
        };

        // Nodes should not be loaded before related stores are set, thus we postpone root loading
        // to the time when class is constructed and related stores are set
        // {{{ Initial root loading and superclass construction
        var configuredRoot = config.root || this.root;
        this.root = null;
        delete config.root;

        this.callParent([ config ]);

        this.setResourceStore(resourceStore);
        this.setAssignmentStore(assignmentStore);
        this.setDependencyStore(dependencyStore);

        configuredRoot && this.setRoot(configuredRoot);
        // }}}

        this.setupListeners();

        this.fillTasksWithDepInfo();

        var root = this.getRootNode();

        if (root && this.autoNormalizeNodes) {
            root.normalizeParent();
        }

        if (this.autoSync && this.batchSync) {
            // Prevent operations with side effects to create lots of individual server requests
            this.sync = Ext.Function.createBuffered(this.sync, 500);
        }

        this.initTreeFiltering();
    },

    setupListeners  : function () {
        this.on({
            nodeappend      : this.onMyNodeAdded,
            nodeinsert      : this.onMyNodeAdded,
            update          : this.onTaskUpdated,

            scope           : this
        });

        this.on({
            noderemove      : this.onTaskRemoved,
            nodemove        : this.onTaskMoved,
            write           : this.onTaskStoreWrite,
            sort            : this.onTasksSorted,
            load            : this.onTasksLoaded,
            rootchange      : this.onTasksLoaded,
            scope           : this,
            // This should guarantee that our listeners are run first since view should
            // only refresh after we've updated cached dependencies for each task (on store load, root change etc)
            priority        : 100
        });
    },

    // Overriden from EventStore mixin to turn off EventStore mixin's logic related to resource->events caching
    // which comes into play in abscence of assignment store
    createResourceEventsCache : Ext.emptyFn,

    // Overriden from EventStore mixin to provide Gantt model aware id consistency manager
    createIdConsistencyManager : function() {
        var me = this;
        return new Gnt.data.util.IdConsistencyManager({
            eventStore      : me,
            resourceStore   : me.getResourceStore(),
            assignmentStore : me.getAssignmentStore(),
            dependencyStore : me.getDependencyStore()
        });
    },

    // Overriden from EventStore mixin to provide Gantt model aware model persistency manager
    createModelPersistencyManager : function() {
        var me = this;
        return new Gnt.data.util.ModelPersistencyManager({
            eventStore      : me,
            resourceStore   : me.getResourceStore(),
            assignmentStore : me.getAssignmentStore(),
            dependencyStore : me.getDependencyStore()
        });
    },

    fillNode: function(node, newNodes) {

        // this flag will prevent the "autoTimeSpan" feature from reacting on individual "append" events, which happens a lot
        // before the "rootchange" event

        if (node.isRoot()) {
            this.isSettingRoot = true;
        }

        this.callParent(arguments);

        if (node.isRoot()) {
            this.isSettingRoot = false;
        }
    },

    onTasksLoaded : function () {
        var root = this.getRoot();

        this.fillTasksWithDepInfoCounter    = 1;

        this.fillTasksWithDepInfo();

        if (root && this.autoNormalizeNodes) {
            root.normalizeParent();
        }
    },

    load : function (options) {
        // Overridden to avoid reacting to the removing of all the records in the store
        this.un("noderemove", this.onTaskRemoved, this);

        // 5.0.1 Seems Ext is using regular "appendChild" method during store load, which triggers all the corresponding events
        // we don't want to react on those events during loading (recalculate parents, etc)
        this.un("nodeappend", this.onMyNodeAdded, this);
        this.un("update", this.onTaskUpdated, this);

        // Note, that gantt uses additional important override for `load` method for ExtJS 4.2.1 and below, inherited from
        // Sch.data.mixin.FilterableTreeStore
        this.callParent(arguments);

        this.on("noderemove", this.onTaskRemoved, this);
        this.on("nodeappend", this.onMyNodeAdded, this);
        this.on("update", this.onTaskUpdated, this);
    },


    // After the task store proxy is set we map provided "typeProperty"
    // to the reader being used
    setProxy : function () {
        this.callParent(arguments);

        if (this.typeProperty) {

            var me      = this,
                reader  = me.getProxy() && me.getProxy().getReader();

            // if user has not provided "typeProperty" directly to the reader
            if (reader && !reader.getTypeProperty()) {
                reader.setTypeProperty(me.typeProperty);
            }

        }
    },

    setRoot : function (rootNode) {
        var me                  = this;
        // Ext5 NOTE: we check this.count() since it might break loading of data from "root" config if we call getRoot() too early
        var oldRoot             = this.count() && this.getRoot();

        // this flag will prevent the "autoTimeSpan" feature from reacting on individual "append" events, which happens a lot
        // before the "rootchange" event
        this.isSettingRoot      = true;

        Ext.apply(rootNode, {
            calendar            : me.calendar,
            taskStore           : me,                 // TODO: this is probably not needed anymore
            dependencyStore     : me.dependencyStore, // TODO: this is probably not needed anymore

            // TODO: this is probably not working because phantom is set to true directly in superclass' setRoot() implementation
            // HACK Prevent tree store from trying to 'create' the root node
            phantom             : false,
            dirty               : false
        });

        var res                 = this.callParent(arguments);

        this.isSettingRoot      = false;

        // we reset taskStore property on the tasks of the old root when we set the new root
        oldRoot && oldRoot.cascadeBy(function (node) {
            node.setTaskStore(null);
        });

        return res;
    },


    /**
     * Returns a dependecy store instance this task store is associated with. See also {@link #setDependencyStore}.
     *
     * @return {Gnt.data.DependencyStore}
     */
    getDependencyStore : function () {
        return this.dependencyStore;
    },

    // TODO: this should be removed after dependency store will use normal caching mechanics like assignment store does
    fillTasksWithDepInfo : function () {
        if (!this.getRootNode()) return;

        var dependencyStore   = this.getDependencyStore();

        // do not iterate for the 1st call - since tasks already has these arrays set in the constructor
        if (this.fillTasksWithDepInfoCounter++ > 0) {
            this.forEachTaskUnordered(function (task) {
                task.successors     = [];
                task.predecessors   = [];
            });
        }

        if (dependencyStore) {
            dependencyStore.each(function (dependency) {
                var from    = dependency.getSourceTask(),
                    to      = dependency.getTargetTask();

                if (from && to) {
                    from.successors.push(dependency);
                    to.predecessors.push(dependency);
                }
            });
        }
    },


    /**
     * Sets the dependency store for this task store
     *
     * @param {Gnt.data.DependencyStore} dependencyStore
     */
    setDependencyStore : function (dependencyStore) {
        var me = this,
            oldStore = me.dependencyStore,
            listeners       = {
                add         : me.onDependencyAdd,
                update      : me.onDependencyUpdate,
                remove      : me.onDependencyDelete,
                scope       : me
            };

        if (me.dependencyStore) {
            me.dependencyStore.un(listeners);
            me.dependencyStore.setTaskStore(null);
            me.idConsistencyManager && me.idConsistencyManager.setDependencyStore(null);
            me.modelPersistencyManager && me.modelPersistencyManager.setDependencyStore(null);
        }

        me.dependencyStore = dependencyStore && Ext.StoreMgr.lookup(dependencyStore) || null;

        if (me.dependencyStore) {
            me.modelPersistencyManager && me.modelPersistencyManager.setDependencyStore(me.dependencyStore);
            me.idConsistencyManager && me.idConsistencyManager.setDependencyStore(me.dependencyStore);
            me.dependencyStore.setTaskStore(me);
            me.dependencyStore.on(listeners);
            me.fillTasksWithDepInfo(); // TODO: check if this is needed and remove if it's not (or refactor)
        }

        if ((oldStore || dependencyStore) && oldStore !== dependencyStore) {
            /**
             * @event dependencystorechange
             * Fires when new dependency store is set via {@link #setDependencyStore} method.
             * @param {Gnt.data.TaskStore}           this
             * @param {Gnt.data.DependencyStore|null} newAssignmentStore
             * @param {Gnt.data.DependencyStore|null} oldAssignmentStore
             */
            // Method might be called before class is fully constructed thus we check for observable mixin to be ready
            me.events && me.fireEvent('dependencystorechange', me, dependencyStore, oldStore);
        }
    },

    /**
     * Returns a resource store instance this task store is associated with. See also {@link #setResourceStore}.
     *
     * @return {Gnt.data.ResourceStore}
     */
    getResourceStore : function () {
        return this.resourceStore || null;
    },

    /**
     * Sets the resource store for this task store
     *
     * @param {Gnt.data.ResourceStore} resourceStore
     */
    setResourceStore : function (resourceStore) {
        var me = this,
            oldStore = me.resourceStore;

        if (me.resourceStore) {
            me.resourceStore.setTaskStore(null);
            me.idConsistencyManager && me.idConsistencyManager.setResourceStore(null);
            me.modelPersistencyManager && me.modelPersistencyManager.setResourceStore(null);
        }

        me.resourceStore = resourceStore && Ext.StoreMgr.lookup(resourceStore) || null;

        if (me.resourceStore) {
            me.modelPersistencyManager && me.modelPersistencyManager.setResourceStore(me.resourceStore);
            me.idConsistencyManager && me.idConsistencyManager.setResourceStore(me.resourceStore);
            me.resourceStore.setTaskStore(me);
            me.resourceStore.normalizeResources();
        }

        if ((oldStore || resourceStore) && (oldStore !== resourceStore)) {
           /**
             * @event resourcestorechange
             * Fires when new resource store is set via {@link #setResourceStore} method.
             * @param {Gnt.data.TaskStore}          this
             * @param {Gnt.data.ResourceStore|null} newResourceStore
             * @param {Gnt.data.ResourceStore|null} oldResourceStore
             */
            // Method might be called before class is fully constructed thus we check for observable mixin to be ready
            me.events && me.fireEvent('resourcestorechange', me, resourceStore, oldStore);
        }
    },


    /**
     * Returns an assignment store this task store is associated with. See also {@link #setAssignmentStore}.
     *
     * @return {Gnt.data.AssignmentStore}
     */
    getAssignmentStore : function(){
        return this.assignmentStore || null;
    },


    /**
     * Sets the assignment store for this task store
     *
     * @param {Gnt.data.AssignmentStore} assignmentStore
     */
    setAssignmentStore : function (assignmentStore) {
        var me = this,
            oldStore = me.assignmentStore,
            listeners = {
                add    : me.onAssignmentStructureMutation,
                update : me.onAssignmentMutation,
                remove : me.onAssignmentStructureMutation,
                scope  : me
            };

        if (me.assignmentStore) {
            me.assignmentStore.un(listeners);
            me.assignmentStore.setTaskStore(null);
            me.idConsistencyManager && me.idConsistencyManager.setAssignmentStore(null);
            me.modelPersistencyManager && me.modelPersistencyManager.setAssignmentStore(null);
        }

        me.assignmentStore = assignmentStore && Ext.StoreMgr.lookup(assignmentStore) || null;

        if (me.assignmentStore) {
            me.modelPersistencyManager && me.modelPersistencyManager.setAssignmentStore(me.assignmentStore);
            me.idConsistencyManager && me.idConsistencyManager.setAssignmentStore(me.assignmentStore);
            assignmentStore.setTaskStore(me);
            assignmentStore.on(listeners);
        }

        if ((oldStore || assignmentStore) && oldStore !== assignmentStore) {
            /**
             * @event assignmentstorechange
             * Fires when new assignment store is set via {@link #setAssignmentStore} method.
             * @param {Gnt.data.TaskStore}            this
             * @param {Gnt.data.AssignmentStore|null} newAssignmentStore
             * @param {Gnt.data.AssignmentStore|null} oldAssignmentStore
             */
            // Method might be called before class is fully constructed thus we check for observable mixin to be ready
            me.events && me.fireEvent('assignmentstorechange', me, assignmentStore, oldStore);
        }
    },


    /**
     * Call this method if you want to adjust tasks according to the calendar dates.
     * @param  {Gnt.modelTask/Gnt.modelTask[]} [tasks] Task or list of tasks to be adjusted. If omitted all tasks will be adjusted.
     * @param  {Function} callback Function to call on propagation changes completion or failure.
     */
    adjustToCalendar : function (tasks, callback) {
        var me = this;

        // reset early/late dates cache
        me.resetEarlyDates();
        me.resetLateDates();

        if (tasks instanceof Gnt.model.Task) {
            tasks.adjustToCalendar(callback);

        } else {

            if (Ext.isFunction(tasks)) {
                callback    = tasks;
                tasks       = [];
            }

            var root        = me.getRootNode(),
                doneNodes   = {};

            // if no tasks provided
            if (!Ext.isArray(tasks) || !tasks.length) {
                // get 1st level tasks
                tasks       = root && root.childNodes || [];
            }

            // loop over the tasks
            for (var i = 0, l = tasks.length; i < l; i++) {
                var node    = tasks[i];

                // check if the task is not processed yet
                if (!doneNodes[node.getId()]) {
                    // we will initiate propagation starting from the node
                    node.propagateChanges(function () {
                        // each node's child we adjust to calendar
                        node.cascadeBy(function (n) {
                            if (n !== root) n.adjustToCalendarWithoutPropagation();
                        });

                        return node;

                    }, function (cancel, affected) {
                        // remember tasks already processed as result of changes propagation
                        if (!cancel) Ext.apply(doneNodes, affected);

                        callback && callback.apply(this, arguments);
                    });
                }
            }
        }
    },

    /**
     * Call this method if you want to adjust the tasks according to the calendar dates.
     * @deprecated This method is internal. Please use {@link #adjustToCalendar} instead.
     * @private
     */
    renormalizeTasks : function (store, nodes, callback) {
        this.adjustToCalendar(nodes, callback);
    },

    /**
     * Returns a project calendar instance.
     *
     * @return {Gnt.data.Calendar}
     */
    getCalendar : function () {
        return this.calendar || null;
    },


    /**
     * Sets the calendar for this task store
     *
     * @param {Gnt.data.Calendar} calendar
     */
    setCalendar : function (calendar, doNotChangeTasks, suppressEvent) {
        var listeners = {
            calendarchange      : this.renormalizeTasks,

            scope               : this
        };

        if (this.calendar) {
            this.calendar.un(listeners);
        }

        this.calendar           = calendar;

        if (calendar) {
            calendar.on(listeners);

            var root                = this.getRootNode();

            if (root) {
                root.calendar       = calendar;
            }

            if (!doNotChangeTasks) {
                this.renormalizeTasks();
            }

            if (!suppressEvent) {
                this.fireEvent('calendarset', this, calendar);
            }
        }
    },


    /**
     * Returns the critical path(s) that can affect the end date of the project
     * @return {Array} paths An array of arrays (containing task chains)
     */
    getCriticalPaths: function () {
        // Grab task id's that don't have any "incoming" dependencies
        var root                = this.getRootNode(),
            finalTasks          = [],
            lastTaskEndDate     = new Date(0);

        // find the project end date
        root.cascadeBy(function (task) {
            lastTaskEndDate = Sch.util.Date.max(task.getEndDate(), lastTaskEndDate);
        });

        // find the tasks that ends on that date
        root.cascadeBy(function (task) {
            //                                                              do not include the parent tasks that has children
            //                                                              since their influence on the project end date is determined by its children
            if (lastTaskEndDate - task.getEndDate() === 0 && !task.isRoot() && !(!task.isLeaf() && task.childNodes.length)) {
                finalTasks.push(task);
            }
        });

        return Ext.Array.map(finalTasks, function (task) {
            return task.getCriticalPaths();
        });
    },

    onMyNodeAdded : function (parent, node) {
        if (!node.isRoot()) {
            if (this.lastTotalTimeSpan) {
                var span = this.getTotalTimeSpan();

                // if new task dates violates cached total range then let's reset getTotalTimeSpan() cache
                if (node.getEndDate() > span.end || node.getStartDate() < span.start) {
                    this.lastTotalTimeSpan = null;
                }
            }

            // if it's a latest task
            if (node.getEndDate() - this.getProjectEndDate() === 0) {
                this.resetLateDates();
            }

            if (!this.cascading && this.recalculateParents && !this.suspendAutoRecalculateParents) {
                if (this.updating) {
                    this.pendingDataUpdates.recalculateParents[node.getId()] = node;
                }
                else {
                    node.recalculateParents();
                }
            }
        }
    },


    onTaskUpdated : function (store, task, operation) {
        var prev = task.previous;

        if (this.lastTotalTimeSpan) {
            var span = this.getTotalTimeSpan();

            // if new task dates violates cached total range then let's reset the cache
            if (prev && (prev[ task.endDateField ] - span.end === 0 || prev[ task.startDateField ] - span.start === 0) ||
                (task.getEndDate() > span.end || task.getStartDate() < span.start))
            {
                this.lastTotalTimeSpan = null;
            }
        }

        if (!this.cascading && operation !== Ext.data.Model.COMMIT && prev) {

            var doRecalcParents = task.percentDoneField in prev;

            // Check if we should cascade this update to successors
            // We're only interested in cascading operations that affect the start/end dates
            if (
                task.startDateField in prev ||
                task.endDateField in prev   ||
                'parentId' in prev          ||
                task.effortField in prev    ||
                // if task has changed _from_ manually scheduled mode
                prev[ task.schedulingModeField ] === 'Manual' || prev[ task.manuallyScheduledField ]
            ) {

                var cascadeSourceTask = task;

                if (this.cascadeChanges && !this.suspendAutoCascade) {
                    // if we switched scheduling mode from manual then we'll call cascadeChangesForTask() for some of
                    // task predecessors (if any) to update task itself
                    if (prev[ cascadeSourceTask.schedulingModeField ] == 'Manual') {
                        var deps = cascadeSourceTask.getIncomingDependencies(true);

                        if (deps.length) {
                            cascadeSourceTask = deps[ 0 ].getSourceTask();
                        }
                    }

                    Ext.Function.defer(this.cascadeChangesForTask, this.cascadeDelay, this, [ cascadeSourceTask ]);
                } else {
                    // reset early/late dates cache
                    this.resetEarlyDates();
                    this.resetLateDates();
                }

                doRecalcParents = true;

            // if task scheduling turned to manual
            } else if ((prev[ task.schedulingModeField ] || task.manuallyScheduledField in prev) && task.isManuallyScheduled()) {
                // reset early/late dates cache
                this.resetEarlyDates();
                this.resetLateDates();
            }

            if (doRecalcParents && this.recalculateParents && !this.suspendAutoRecalculateParents) {
                if (this.updating) {
                    this.pendingDataUpdates.recalculateParents[task.getId()] = task;
                }
                else {
                    task.recalculateParents();
                }
            }
        }
    },

    onEndUpdate : function() {
        var me = this,
            toRecalculateParents = {},
            task, siblings;

        Ext.Object.each(me.pendingDataUpdates.recalculateParents, function(id, task) {
            task.parentNode && (toRecalculateParents[task.parentNode.getId()] = task.parentNode);
        });

        // Sorting lower depth first, but then pop()'ing to process deepest depth first
        toRecalculateParents = Ext.Array.sort(Ext.Object.getValues(toRecalculateParents), function(a, b) {
            return (a.data.depth > b.data.depth) ? 1 : ((a.data.depth < b.data.depth) ? -1 : 0);
        });

        while (toRecalculateParents.length > 0) {
            task = toRecalculateParents.pop();
            task.refreshCalculatedParentNodeData();
            task.recalculateParents();
        }

        me.pendingDataUpdates.recalculateParents = {};

        return me.callParent(arguments);
    },

    getEmptyCascadeBatch : function () {
        var me      = this;

        return {
            nbrAffected         : 0,
            affected            : {},

            visitedCounters     : {},

            addVisited          : function (task) {
                var internalId      = task.internalId;

                if (!this.visitedCounters[ internalId ]) {
                    this.visitedCounters[ internalId ]     = 1;
                } else {
                    this.visitedCounters[ internalId ]++;
                }
            },

            addAffected         : function (task, doNotAddParents) {
                var internalId      = task.internalId;

                if (this.affected[ internalId ]) {
                    // already added
                    return;
                } else {
                    this.affected[ internalId ]            = task;
                    this.nbrAffected++;
                }

                if (!me.cascading && this.nbrAffected > 1) {
                    me.fireEvent('beforecascade', me);
                    me.cascading = true;
                }

                if (!doNotAddParents) {
                    var byId        = this.affectedParentsbyInternalId;
                    var array       = this.affectedParentsArray;
                    var parent      = task.isLeaf() ? task.parentNode : task;

                    while (parent && !parent.data.root) {
                        if (byId[ parent.internalId ]) break;

                        byId[ parent.internalId ]   = parent;
                        array.push(parent);

                        this.addAffected(parent, true);

                        parent      = parent.parentNode;
                    }
                }
            },

            affectedParentsArray            : [],
            affectedParentsbyInternalId     : {},

            parentsStartDates               : {}
        };
    },


    // starts a `batched` cascade (can contain several cascades, combined in one `currentCascadeBatch` context
    // cascade batch may actually contain 0 cascades (if for example deps are invalid)
    startBatchCascade : function () {
        if (!this.batchCascadeLevel) {
            this.currentCascadeBatch = this.getEmptyCascadeBatch();

            this.suspendAutoRecalculateParents++;
            this.suspendAutoCascade++;
        }

        this.batchCascadeLevel++;

        return this.currentCascadeBatch;
    },


    endBatchCascade : function () {

        this.batchCascadeLevel--;

        if (!this.batchCascadeLevel) {
            this.suspendAutoRecalculateParents--;
            this.suspendAutoCascade--;

            var currentCascadeBatch     = this.currentCascadeBatch;
            this.currentCascadeBatch    = null;

            this.resetEarlyDates();
            this.resetLateDates();

            if (this.cascading) {
                this.cascading          = false;
                this.fireEvent('cascade', this, currentCascadeBatch);
            }
        }
    },


    /**
     * @deprecated
     *
     * Use {@link Gnt.model.Task#propagateChanges} instead.
     *
     * Cascade the updates to the *depended* tasks of given `task` (re-schedule them according to dependencies and constraints).
     *
     * Note, that source task of cascading is considered already having "stable" position, which will not be adjusted in any way.
     * Also, the cascading process is asynchronous (because of potential constraints violations).
     *
     * @param {Gnt.model.Task} sourceTask
     * @param {Function} callback A function to call after the casading has been completed.
     */
    cascadeChangesForTask : function (sourceTask, callback) {
        sourceTask.propagateChanges(Ext.emptyFn, callback, true);
    },


    removeTaskDependencies : function (task) {
        var dependencyStore     = this.dependencyStore,
            deps                = task.getAllDependencies(dependencyStore);
        if (deps.length) dependencyStore.remove(deps);
    },


    removeTaskAssignments : function (task) {
        var assignmentStore     = this.getAssignmentStore(),
            assignments         = task.getAssignments();
        if (assignments.length) assignmentStore.remove(assignments);
    },


    // TODO: constraints
    onTaskRemoved : function (store, removedNode, isMove) {
        var dependencyStore = this.getDependencyStore();
        var assignmentStore = this.getAssignmentStore();

        var taskDropped     = !removedNode.isReplace && !isMove;

        // remove dependencies associated with the task
        if (dependencyStore && taskDropped) {
            removedNode.cascadeBy(this.removeTaskDependencies, this);
        }


        // remove task assignments
        if (assignmentStore && taskDropped) {
            // Fire this event so UI can ignore the datachanged events possibly fired below
            assignmentStore.fireEvent('beforetaskassignmentschange', assignmentStore, removedNode.getId(), []);

            removedNode.cascadeBy(this.removeTaskAssignments, this);

            // Fire this event so UI can just react and update the row for the task
            assignmentStore.fireEvent('taskassignmentschanged', assignmentStore, removedNode.getId(), []);
        }

        var span        = this.getTotalTimeSpan();
        var startDate   = removedNode.getStartDate();
        var endDate     = removedNode.getEndDate();

        // if removed task dates were equal to total range then removing can affect total time span
        // so let's reset getTotalTimeSpan() cache
        if (endDate - span.end === 0 || startDate - span.start === 0) {
            this.lastTotalTimeSpan = null;
        }

        // mark task that it's no longer belong to the task store
        if (taskDropped) removedNode.setTaskStore(null);

        //if early/late dates are supported
        this.resetEarlyDates();
        this.resetLateDates();
    },

    onTaskMoved : function (task, oldParent, newParent, index) {
        var span        = this.getTotalTimeSpan();
        var startDate   = task.getStartDate();
        var endDate     = task.getEndDate();

        // if removed task dates were equal to total range then removing can affect total time span
        // so let's reset getTotalTimeSpan() cache
        if (endDate - span.end === 0 || startDate - span.start === 0) {
            this.lastTotalTimeSpan = null;
        }

        //if early/late dates are supported
        this.resetEarlyDates();
        this.resetLateDates();
    },

    // TODO: constraints
    onAssignmentMutation : function (assignmentStore, assignments) {
        var me      = this;

        Ext.each(assignments, function (assignment) {
            // Taskstore could be filtered etc.
            var t = assignment.getTask(me);
            if (t) {
                t.onAssignmentMutation(assignment);
            }
        });
    },


    // TODO: constraints
    onAssignmentStructureMutation : function (assignmentStore, assignments) {
        var me      = this;

        Ext.each(assignments, function (assignment) {
            var task  = assignment.getTask(me);

            if (task) {
                task.onAssignmentStructureMutation(assignment);
            }
        });
    },


    onDependencyUpdate : function (store, dependency, operation) {
        if (operation !== Ext.data.Model.COMMIT) {
            this.onDependencyAdd(store, dependency);
        }
    },


    onDependencyAdd: function (store, dependencies) {
        // reset early late dates cache
        this.resetEarlyDates();
        this.resetLateDates();

        // TODO: the following is very fragile code in case any constraint is violated (and we switch to async
        // execution) we should not propagate changes here, all changes should be propagated using corresponding
        // task/dependency model interface (linkTo/unlinkFrom etc).
        // -- Maxim

        // If cascade changes is activated, adjust the connected task start/end date
        if (this.cascadeChanges && !this.suspendAutoCascade) {
            var me    = this,
                tasks = [];

            if (Ext.isArray(dependencies)) {
                Ext.Array.forEach(dependencies, function(dependency) {
                    var source = dependency.getSourceTask();
                    source && tasks.push(source);
                });
                tasks.length && me.getRoot().propagateChanges(function() { return tasks; });
            }
            else {
                tasks = dependencies.getSourceTask();
                tasks && tasks.propagateChanges();
            }
        }
    },

    onDependencyDelete: function (store, dependencies) {
        // reset early late dates cache
        this.resetEarlyDates();
        this.resetLateDates();
    },

//
//    // @Ext 5 TODO
//
//    // pass "this" to filter function
//    getNewRecords: function() {
//        return Ext.Array.filter(this.tree.flatten(), this.filterNew, this);
//    },
//
//    // pass "this" to filter function
//    getUpdatedRecords: function() {
//        return Ext.Array.filter(this.tree.flatten(), this.filterUpdated, this);
//    },
//
//
//    // ignore root
//    // @OVERRIDE
//    filterNew: function(item) {
//        // only want phantom records that are valid
//        return item.phantom && item.isValid() && item != this.tree.root;
//    },
//
//
//    // ignore root
//    // @OVERRIDE
//    filterUpdated: function(item) {
//        // only want dirty records, not phantoms that are valid
//        return item.dirty && !item.phantom && item.isValid() && item != this.tree.root;
//    },
//
//

    // TODO: chieck if it's needed and remove it if it's not
    // When store has synced, we need to update phantom tasks which have now have a 'real' Id
    // and can be written to the backend
    onTaskStoreWrite : function(store, operation) {
        var me = this,
            records = operation.getRecords(),
            triggerNewSync;

        Ext.each(records, function(task) {
            Ext.each(task.childNodes, function(child) {
                if (child.phantom) {
                    triggerNewSync = true;
                    return false;
                }
            });
        });
        // In the case of autoSync, a new sync will be triggered after a parent node is 'realized',
        // since Ext JS then sets a new 'parentId' property on all the childNodes.
        if (triggerNewSync && !this.autoSync) {
            // Ext JS won't let you call sync inside a 'write' handler, need to defer the call
            // http://www.sencha.com/forum/showthread.php?283908-Store-quot-isSyncing-quot-true-inside-a-write-listener
            setTimeout(function() { me.sync(); }, 1);
        }
    },

    forEachTaskUnordered: function (fn, scope) {
        var root    = this.getRootNode();

        if (root) {
            root.cascadeBy(function(rec) {
                if (rec !== root) {
                    return fn.call(scope || this, rec);
                }
            });
        }
    },

    getTimeSpanForTasks : function(tasks) {
        var earliest = new Date(9999,0,1), latest = new Date(0);

        var compareFn = function(r) {
            var startDate = r.getStartDate();
            var endDate = r.getEndDate();

            if (startDate && startDate < earliest) {
                earliest = startDate;
            }

            // Ignore tasks without start date as they aren't rendered anyway
            if (startDate && endDate && endDate > latest) {
                latest = endDate;
            }
        };

        if (tasks) {
            if (!Ext.isArray(tasks)) tasks = [tasks];

            Ext.Array.each(tasks, compareFn);
        } else {
            this.forEachTaskUnordered(compareFn);
        }

        earliest    = earliest < new Date(9999,0,1) ? earliest : null;
        latest      = latest > new Date(0) ? latest : null;

        return {
            start   : earliest,
            end     : latest || (earliest && Ext.Date.add(earliest, Ext.Date.DAY, 1)) || null
        };
    },

    /**
     * Returns an object defining the earliest start date and the latest end date of all the tasks in the store.
     * Tasks without start date are ignored, tasks without end date use their start date (if any) + 1 day
     * @return {Object} An object with 'start' and 'end' Date properties.
     */
    getTotalTimeSpan : function() {
        if (this.lastTotalTimeSpan) return this.lastTotalTimeSpan;

        this.lastTotalTimeSpan = this.getTimeSpanForTasks();

        return this.lastTotalTimeSpan;
    },

    /**
     * Returns the project start date. This value is calculated (using {@link #getTotalTimeSpan} method) as an earliest start of all the tasks in the store.
     * **Note:** You can override this method to make alternative way of project start date calculation
     * (or for example to make this value configurable to store it in a database).
     * @return {Date} The project start date.
     */
    getProjectStartDate : function () {
        return this.getTotalTimeSpan().start;
    },

    /**
     * Returns the project end date. This value is calculated (using {@link #getTotalTimeSpan} method) as a latest end of all the tasks in the store.
     * @return {Date} The project end date.
     */
    getProjectEndDate : function () {
        return this.getTotalTimeSpan().end;
    },


    /**
     * Returns all projects kept in the store.
     * @return {Gnt.model.Project[]}
     */
    getProjects : function () {
        var root        = this.getRoot(),
            projects    = [],
            childNodes  = root.childNodes;

        for (var i = 0, l = childNodes.length; i < l; i++) {
            if (childNodes[i].isProject) {
                projects.push(childNodes[i]);
            }
        }

        return projects;
    },

    // Internal helper method
    getTotalTaskCount : function(ignoreRoot) {
        var count = ignoreRoot === false ? 1 : 0;

        this.forEachTaskUnordered(function() { count++; });
        return count;
    },

    /**
     * Returns an array of all the tasks in this store.
     *
     * @return {Gnt.model.Task[]} The tasks currently loaded in the store
     */
    toArray : function() {
        var tasks = [];

        this.getRootNode().cascadeBy(function(t) {
            tasks.push(t);
        });

        return tasks;
    },

    /**
     * Increase the indendation level of one or more tasks in the tree
     * @param {Gnt.model.Task/Gnt.model.Task[]} tasks The task(s) to indent
     */
    indent: function (nodes) {

        this.fireEvent('beforeindentationchange', this, nodes);

        // TODO: method should fail (and return false?) if passed nodes are from different parent nodes
        nodes       = Ext.isArray(nodes) ? nodes.slice() : [ nodes ];

        nodes.sort(function(a, b) { return a.data.index - b.data.index; });

        this.suspendEvents(true);

        Ext.each(nodes, function(node) { node.indent(); });

        this.resumeEvents();

        this.fireEvent('indentationchange', this, nodes);
    },


    /**
     * Decrease the indendation level of one or more tasks in the tree
     * @param {Gnt.model.Task/Gnt.model.Task[]} tasks The task(s) to outdent
     */
    outdent: function (nodes) {
        this.fireEvent('beforeindentationchange', this, nodes);

        // TODO method should fail (and return false?) if passed nodes are from different parent nodes
        nodes       = Ext.isArray(nodes) ? nodes.slice() : [ nodes ];

        nodes.sort(function(a, b) { return b.data.index - a.data.index; });
        this.suspendEvents(true);

        Ext.each(nodes, function(node) { node.outdent(); });

        this.resumeEvents();

        this.fireEvent('indentationchange', this, nodes);
    },

    /**
     * Returns the tasks associated with a resource
     * @param {Gnt.model.Resource} resource
     * @return {[Gnt.model.Task] the tasks assigned to this resource
     */
    getTasksForResource: function (resource) {
        return this.getEventsForResource(resource);
    },

    /**
     * Returns the resources associated with a task
     * @param {Gnt.model.Task} task
     * @return {[Gnt.model.Resource]}
     */
    getResourcesForTask : function (task) {
        return this.getResourcesForEvent(task);
    },

    // Event store adaptions (flat store vs tree store)

    forEachScheduledEvent : function (fn, scope) {
        scope  = scope || this;

        this.forEachTaskUnordered(function (event) {
            var eventStart = event.getStartDate(),
                eventEnd = event.getEndDate();

            if (eventStart && eventEnd) {
                return fn.call(scope, event, eventStart, eventEnd);
            }
        });
    },

    onTasksSorted : function() {
        // After sorting we need to reapply filters if store was previously filtered
        if (this.lastTreeFilter) {
            this.filterTreeBy(this.lastTreeFilter);
        }
    },

    /**
     * Appends a new task to the store
     * @param {Gnt.model.Task/Object} record The record to append to the store
     * @return {Gnt.model.Task} The appended record
     */
    append : function(record) {
        return this.getRootNode().appendChild(record);
    },

    resetEarlyDates : function (suppress) {
        this.earlyStartDates = {};
        this.earlyEndDates = {};
        if (!suppress) this.fireEvent('resetearlydates');
    },

    resetLateDates : function (suppress) {
        this.lateStartDates = {};
        this.lateEndDates = {};
        if (!suppress) this.fireEvent('resetlatedates');
    },

    /**
     * Returns Task by sequential number. See {@link Gnt.model.Task#getSequenceNumber} for details.
     *
     * @param {Number} number
     *
     * @return {Gnt.model.Task}
     */
    getBySequenceNumber : function(number) {
        return this.getRootNode().getBySequenceNumber(number);
    },

    destroy : function() {
        this.setCalendar(null);
        this.setAssignmentStore(null);
        this.setDependencyStore(null);
        this.setResourceStore(null);

        if (this.calendarManagerListeners) {
            this.calendarManagerListeners.destroy();
        }

        this.callParent(arguments);
    },


    moveSeveralTasks : function (taskConsumer) {
        // this will suspend auto-cascade and auto-recalculate parents
        var currentCascadeBatch             = this.startBatchCascade();

        var taskMovement;

        while (taskMovement = taskConsumer()) {
            var task            = taskMovement.task;

            // in case a parent task has no children it should be treated as a leaf
            if (task.isLeaf() || !task.childNodes.length) {
                // do not try to re-position manually scheduled tasks and the tasks, affected by cascading
                if (!currentCascadeBatch.affected[ task.internalId ]) {
                    // add child tasks to the cascade context as affected ones
                    // its not a cascade in previous meaning, but still can be seen as such,
                    // because parent task "pushes" date changes to its children
                    currentCascadeBatch.addAffected(task);

                    // this won't cascade because cascading is suspended
                    taskMovement.method && task[ taskMovement.method ].apply(task, taskMovement.args);

                    if (this.cascadeChanges) {
                        // cascading manually, saving affected tasks
                        this.cascadeChangesForTask(task);
                    }
                }

            } else {
                if (this.recalculateParents) currentCascadeBatch.addAffected(task);
            }
        }

        // will resume auto-cascade and auto-recalculate parents
        this.endBatchCascade();
    },


    linearWalkDependentTasks : function (sourceTaskList, processor, walkingSpecification) {
        var me = this;

        // <debug>
        !walkingSpecification || Ext.isObject(walkingSpecification) ||
            Ext.Error.raise("Invalid arguments: walking specification must be an object");
        // </debug>

        walkingSpecification = walkingSpecification || {
            self        : true,
            ancestors   : me.recalculateParents,
            descendants : me.moveParentAsGroup,
            successors  : me.cascadeChanges,
            cycles      : me.cycleResolutionStrategy
        };

        return Gnt.data.Linearizator.linearWalkBySpecification(
            sourceTaskList,
            processor,
            walkingSpecification
        );
    },


    getLinearWalkingSequenceForDependentTasks : function (sourceTaskList, walkingSpecification) {
        var result      = [];

        this.linearWalkDependentTasks(sourceTaskList, function (task, color, sourceSet, depsData) {
            result.push(Array.prototype.slice.call(arguments));
        }, walkingSpecification);

        return result;
    },

    // @override
    // ExtJS doesn't use getters in this method but we need to use them to take model projections into account.
    // We literally copied Ext.data.TreeStore.isVisible and replaced every node.data.* with node.get(*)
    isVisible   : function (node) {
        var parentNode = node.parentNode,
            visible = node.get('visible'),
            root = this.getRoot();
        while (visible && parentNode) {
            visible = parentNode.get('expanded') && parentNode.get('visible');
            parentNode = parentNode.parentNode;
        }

        return visible && !(node === root && !this.getRootVisible());
    }

}, function() {
    this.override(Sch.data.mixin.FilterableTreeStore.prototype.inheritables() || {});
});
