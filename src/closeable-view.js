(function () {
    "use strict";

    (function (globals, factory) {
        if (typeof define === "function" && define.amd) {
            define(["underscore"], factory);
        } else if (typeof exports === "object") {
            module.exports = factory(require("underscore"));
        } else {
            globals.Dellysse = globals.Dellysse || {};
            globals.Dellysse.CloseableViewMixin = factory(globals._);
        }
    })(this, function (_) {
        var CloseableViewMixin;

        CloseableViewMixin = {
            initialize: function () {
                this.closeableViewOptions = _.extend({
                    viewListName: "views",
                    onBeforeCloseName: "onBeforeClose",
                    closeSubViews: true,
                    empty: false,
                    stopListening: false,
                    remove: true,
                }, this.closeableViewOptions || {});

                this[this.closeableViewOptions.viewListName] = _({});
            },

            closeSubViews: function (list) {
                if (typeof list === "undefined") {
                    list = this[this.closeableViewOptions.viewListName];
                }

                list.forEach(function (view) {
                    if (view === null || typeof view === "undefined") {
                        return;
                    }

                    if (typeof view.close === "function") {
                        view.close();
                    } else if (typeof view.forEach === "function") {
                        this.closeSubViews(view);
                    }
                }, this);
            },

            close: function () {
                if (this.closeableViewOptions.onBeforeCloseName !== null && typeof this[this.closeableViewOptions.onBeforeCloseName] === "function") {
                    this[this.closeableViewOptions.onBeforeCloseName]();
                }

                if (this.closeableViewOptions.closeSubViews) {
                    this.closeSubViews();
                }

                if (this.closeableViewOptions.empty) {
                    this.$el.empty();
                }

                if (this.closeableViewOptions.stopListening) {
                    this.stopListening();
                }

                if (this.closeableViewOptions.remove) {
                    this.$el.remove();
                }
            }
        };

        return CloseableViewMixin;
    });
}).call(this);
