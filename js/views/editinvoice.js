define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        template = $T.compile(require('text!templates/editinvoice.tpl.html'));

    return BaseView.extend({
        events: {
            'keyup input.field': 'updateModel',
            'change input.field': 'updateModel',
            'click #item-save': 'saveItem',
            'click #item-cancel': 'cancelItem'
        },
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);
        },
        updateModel: function (evnt) {
            var $el = $(evnt.currentTarget),
                bindInfo = $el.data('bind').split(':'),
                value = $el[bindInfo[1]]();
            
            this.model.set(bindInfo[0], value, {
                refresh: false,
                forView: this
            });
        },
        updateView: function (model, options) {
            var options = _.defaults(options, {
                refresh: true
            });
            if (options.refresh && options.forView !== this) {
                this.render();
            }
        },
        saveItem: function () {
            this.model.save(null, {
                success: _.bind(this.cancelItem, this)
            });
        },
        cancelItem: function () {
            this.close();
        },
        render: function () {
            var html = template.render(this.model.toJSON());

            this.$el.empty().html(html);
            return this;
        }
    });
});
