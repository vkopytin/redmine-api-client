define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        EditInvoiceView = require('views/editinvoice'),
        InvoiceItemView = require('views/invoiceitem'),
        template = $T.compile(require('text!templates/invoices.tpl.html'));

    return BaseView.extend({
        events: {
            'click .create-item': 'createItem'
        },
        initialize: function () {
            BaseView.prototype.initialize.apply(this, arguments);
            this.collection.on('add', this.addItem, this);
        },
        createItem: function () {
            var view = new EditInvoiceView({
                model: this.collection.create()
            });

            this.$('.create-item-placeholder')
            .empty()
            .append(view.render().el);
        },
        addItem: function (model) {
            var item = new InvoiceItemView({
                app: this.app,
                model: model
            });
            this.$('.invoices-list').append(item.render().el);
        },
        drawItems: function () {
            this.collection.each(this.addItem, this);
        },
        render: function () {
            var html = template.render({});

            this.$el.empty().html(html);

            this.drawItems();

            return this;
        }
    });
});
