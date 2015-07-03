define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        CreateItemView = require('views/createstatementitem'),
        Statement = require('models/statement'),
        StatementItemView = require('views/statementitem'),
        template = $T.compile(require('text!templates/statementsview.tpl.html'));

    return BaseView.extend({
        events: {
            'click .create-item': 'createItem'
        },
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);
            this.collection.on('add', this.onAddStatementItem, this);
        },
        createItem: function () {
            var view = new CreateItemView({
                el: '#create-item-placeholder',
                model: this.collection.create()
            }).render();
        },
        onAddStatementItem: function (model) {
            var div = $('<div></div>'),
                item = new StatementItemView({
                el: div,
                app: this.app,
                model: model
            });
            this.$('#statements-list')
                .append(div);
            item.render();
        },
        drawItems: function () {
            this.collection.each(this.onAddStatementItem, this);
        },
        render: function () {
            var html = template.render({});
            this.$el.html(html);

            this.drawItems();

            return this;
        }
    });
});
