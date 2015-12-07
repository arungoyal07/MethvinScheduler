/**
 * This class extends model persistency management inherited from Sch.data.util.ModelPersistencyManager to dependency
 * store
 *
 * TODO: it should be merged with Sch.data.util.ModelPersistencyManager when dependency store will be moved to Scheduler
 *       as well
 *
 * @private
 */
if (!Ext.ClassManager.get("Gnt.data.util.ModelPersistencyManager")) Ext.define('Gnt.data.util.ModelPersistencyManager', {

    extend : 'Sch.data.util.ModelPersistencyManager',

    config : {
        dependencyStore : null
    },

    dependencyStoreDetacher : null,

    // {{{ Event attachers
    updateDependencyStore : function(newDependencyStore, oldDependencyStore) {
        var me = this;

        Ext.destroyMembers(me, 'dependencyStoreDetacher');

        if (newDependencyStore && newDependencyStore.autoSync) {
            me.dependencyStoreDetacher = newDependencyStore.on({
                beforesync  : me.onDependencyStoreBeforeSync,
                scope       : me,
                destroyable : true,
                // Just in case
                priority    : 100
            });
        }
    },
    // }}}

    // {{{ Event handlers
    onDependencyStoreBeforeSync : function(options) {
        var me = this;
        me.removeNonPersistableRecordsToCreate(options);
        return me.shallContinueSync(options);
    }
    // }}}
});
