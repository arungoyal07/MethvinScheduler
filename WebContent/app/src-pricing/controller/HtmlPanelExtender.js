Ext.define('Pricing.controller.HtmlPanelExtender', {
    extend: 'Ext.Panel',
    alias: 'widget.htmlPanelExtender',
    autoScroll: true,
    constructor: function (config) {
        this.superclass.constructor.apply(this, arguments);
        this.loaded = false;
        this.load = function () {
            if (!this.loaded && this.url && (this.url.length > 0)) {
                Ext.Ajax.request({
                    url: this.url,
                    method: "GET",
                    panel: this,
                    success: function (response, request) {
                        request.panel.update(response.responseText);
                        request.panel.loaded = true;
                    }
                });
            }
        };
        this.on('show', this.load);
        if (this.autoLoad) {
            this.load();
        }
    },
    url: null
});