Ext.define('methwin.client.Application', {
    extend: 'Ext.app.Application',
    mixins: ['Gnt.mixin.Localizable'],
    requires: [
       'methwin.client.locale.En',
        'Ext.window.MessageBox'
    ],

    paths: {
        'Gnt': '../lib/gant-3.0.6/js/Gnt',
        'Sch': '../lib/gant-3.0.6/js/Sch'
    },

    stores: [
        //'Locales'
        'Calendars',
        'TaskStore'
        //'CrudManager'
    ],

    //routes: {
    //    ':lc': {
    //        before: 'onBeforeLocaleEstablished',
    //        action: 'onLocaleEstablished'
    //    }
    //},

    //defaultToken: 'en',

    //listen: {
    //    // Right now we just listen to locale-change on controllers domain, any controller fired that event might
    //    // initiate a locale change procedure
    //    controller: {
    //        '*': {
    //            'locale-change': 'onLocaleChange'
    //        }
    //    }
    //},

    glyphFontFamily: 'bryntum-advanced',
    mainView: null,
    //currentLocale: null,
    //startDate: null,
    //endDate: null,

    //constructor: function (config) {
    //    var me = this;
    //    Ext.Array.each(this.stores, function (store) {
    //        me.getStore(store);
    //    });

    //    this.callParent(arguments);
    //},

    //getStore: function (name) {
    //    // special treatment for CrudManager
    //    if (name == 'CrudManager') {
    //        // if it's not instantiated yet
    //        if (!this.crudManager) {
    //            // callParent will do this
    //            this.crudManager = this.callParent(arguments);

    //            // bind listeners to handle CRUD errors gracefully
    //            this.mon(this.crudManager, {
    //                loadfail: this.onCrudError,
    //                syncfail: this.onCrudError,
    //                scope: this
    //            });
    //        }

    //        return this.crudManager;
    //    }

    //    return this.callParent(arguments);
    //},

    //onCrudError: function (crud, response, responseOptions) {
    //    Ext.Msg.show({
    //        title: this.L('error'),
    //        msg: response.message || this.L('requestError'),
    //        icon: Ext.Msg.ERROR,
    //        buttons: Ext.Msg.OK,
    //        minWidth: Ext.Msg.minWidth
    //    });
    //}

    //onLocaleChange: function (lc, lcRecord) {
    //    this.redirectTo(lc);
    //},

    //onBeforeLocaleEstablished: function (lc, action) {
    //    var me = this,
    //        lcRecord = me.getLocalesStore().getById(lc);

    //    switch (true) {
    //        case lcRecord && !me.mainView && me.currentLocale != lc:

    //            Ext.Loader.loadScript({
    //                // load Ext JS locale for the chosen language
    //                url: 'http://cdn.sencha.com/ext/gpl/5.1.0/build/packages/ext-locale/build/ext-locale-' + lc + '.js',
    //                onLoad: function () {
    //                    var cls = lcRecord.get('cls');
    //                    // load the gantt locale for the chosen language
    //                    Ext.require('Gnt.examples.advanced.locale.' + cls, function () {
    //                        // apply chosen locales
    //                        Sch.locale[cls].apply();
    //                        Gnt.locale[cls].apply();
    //                        Gnt.examples.advanced.locale[cls].apply();

    //                        // Some of Ext JS localization wrapped with Ext.onReady(...)
    //                        // so we have to do the same to instantiate UI after Ext JS localization is applied
    //                        Ext.onReady(function () { action.resume(); });
    //                    });
    //                }
    //            });

    //            break;

    //        case lcRecord && !me.mainView && me.currentLocale == lc:
    //            action.resume();
    //            break;

    //        case lcRecord && me.mainView && true:
    //            me.deactivate();
    //            action.stop();
    //            window.location.hash = '#' + lc;
    //            window.location.reload(true);
    //            break;

    //        default:
    //            action.stop();
    //    }
    //},

    //onLocaleEstablished: function (lc) {
    //    alert('locale established');
    //    var me = this,
    //        crud = me.getCrudManagerStore();

    //    me.currentLocale = lc;

    //    me.mainView = me.getMainViewportView().create({
    //        viewModel: {
    //            type: 'advanced-viewport',
    //            data: {
    //                crud: crud,
    //                taskStore: crud.getTaskStore(),
    //                calendarManager: crud.getCalendarManager(),
    //                currentLocale: me.currentLocale,
    //                availableLocales: me.getLocalesStore()
    //            }
    //        },
    //        crudManager: crud,
    //        startDate: this.startDate,
    //        endDate: this.endDate
    //    });
    //}
});
