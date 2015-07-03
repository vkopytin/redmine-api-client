define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        EditItemView = require('views/editinvoice'),
        template = $T.compile(require('text!templates/invoiceitem.tpl.html'));

    return BaseView.extend({
		tagName: 'li',
        events: {
            'click .edit-item': 'editItem'
        },
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.model.on('change', this.changeItem, this);
            this.model.on('sync', this.render, this);
        },

        editItem: function () {
            var editView = new EditItemView({
                model: this.model
            });
            this.$('.edit-item-placeholder')
                .empty().
                append(editView.render().el);
        },

        changeItem: function (model) {
        },

        render: function () {
            var html = template.render(this.model.toJSON());
            this.$el.empty().html(html);

            return this;
        }
    });
});
