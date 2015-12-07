/**
@class Gnt.column.mixin.TaskFieldColumn
This class implement common logic for fields that have a field mixed with {@link Gnt.field.mixin.TaskField} class as an editor.
Also it makes the column localizable by mixing it with {@link Gnt.mixin.Localizable} class.
*/
Ext.define('Gnt.column.mixin.TaskFieldColumn', {

    extend              : 'Ext.Mixin',

    requires            : [
        'Gnt.patches.TreeColumn'
    ],

    mixins              : [
        'Gnt.mixin.Localizable'
    ],

    /**
     * @cfg {Boolean} instantUpdate Set to `true` to instantly apply any changes in the field to the task.
     * This option is just translated to the {@link Gnt.field.mixin.TaskField#instantUpdate} config option.
     */
    instantUpdate       : false,

    /**
     * @property {Ext.form.field.Field} Reference to the field used by the editor
     */
    field               : null,

    fieldProperty       : '',

    fieldConfigs        : 'instantUpdate',

    defaultEditorXType  : '',

    mixinConfig         : {

        after           : {
            initComponent   : 'afterInitComponent'
        },

        afterIf        : {
            applyColumnCls  : 'applyColumnCls'
        }
    },


    initTaskFieldColumn : function (editorCfg) {
        this.text       = this.config.text || this.L('text');

        if (this.defaultEditorXType) this.initColumnEditor(editorCfg);

        this.scope      = this.scope || this;

        if (this.renderer) {
            this.providedRenderer       = this.renderer;
            this.providedRendererScope  = this.scope;

        } else {
            this.providedRenderer       = this.getValueToRender;
            this.providedRendererScope  = this;
        }

        var me  = this;

        this.renderer   = function () {
            return me.taskFieldRenderer.apply(me, arguments);
        };

        this.mon(this, 'render', this.onColumnRender, this);
    },


    applyColumnCls : function (value, meta, task) {
        if (!task.isEditable(this.dataIndex)) {
            meta.tdCls      = (meta.tdCls || '') + ' sch-column-readonly';
        }
    },


    afterInitComponent : function () {
        // Make sure Ext 'understands' this column has its own renderer which makes sure this column is always updated
        // if any task field is changed
        this.hasCustomRenderer  = true;
    },


    initColumnEditor : function (editorCfg) {
        editorCfg   = Ext.copyTo(editorCfg || {}, this, this.fieldConfigs, true);

        if (!(this.editor instanceof Ext.ClassManager.getByAlias('widget.' + this.defaultEditorXType))) {
            this.editor = Ext.ComponentManager.create(Ext.applyIf(this.editor || {}, editorCfg), this.defaultEditorXType);
        }

        this.field    = this.editor;
    },


    onColumnRender : function() {
        var tree        = this.up('treepanel');
        var taskStore   = tree.store;

        if (!this.dataIndex) {
            this.dataIndex = taskStore.model.prototype[ this.fieldProperty ];
        }
    },


    getValueToRender : function (value, meta, task) {
        var field   = this.field;

        return field && field.valueToVisible(value, task) || value;
    },


    taskFieldRenderer : function (value, meta, task) {
        var result  = Ext.util.Format.htmlEncode( this.providedRenderer.apply(this.providedRendererScope, arguments) );

        this.applyColumnCls(value, meta, task);

        return result;
    },


    afterClassMixedIn : function (cls) {
        var mixin       = this.prototype,
            mixinConfig = mixin.mixinConfig,
            befores     = mixinConfig && mixinConfig.beforeIf,
            afters      = mixinConfig && mixinConfig.afterIf;

        befores && Ext.Object.each(befores, function (key, value) {
            if (key in cls.prototype) {

                cls.addMember(key, function () {
                    if (mixin[value].apply(this, arguments) !== false) {
                        return this.callParent(arguments);
                    }
                });

            } else {

                cls.addMember(key, function () {
                    mixin[value].apply(this, arguments);
                });

            }
        });

        afters && Ext.Object.each(afters, function (key, value) {
            if (key in cls.prototype) {

                cls.addMember(key, function () {
                    this.callParent(arguments);
                    mixin[value].apply(this, arguments);
                });

            } else {

                cls.addMember(key, function () {
                    mixin[value].apply(this, arguments);
                });

            }
        });
    }
});
