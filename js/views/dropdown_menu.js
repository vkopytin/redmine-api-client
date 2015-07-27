define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        ItemView = require('views/itemview'),
        ProjectsCollection = require('collections/redmine/projects');

    return BaseView.extend({
        tagName: 'ul',
        events: {
            'change': 'changeItem'
        },
        template: $T.compile(''),
        ItemView: ItemView,
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);
            this.collection.on('add', this.drawItem, this);
        },
        createItemView: function (options) {
            return new (this.options.ItemView || this.ItemView)(options);
        },
        changeItem: function (evnt) {
            var $el = $(evnt.currentTarget);
            this.trigger('change:item', {
                key: $el.val()
            });
        },
        drawItem: function (model) {
            var item = this.createItemView({
                    tagName: 'li',
                    model: model,
                    onClick: _.bind(function (data) {
                        this.trigger('change:item', data);
                    }, this)
                });

            this.$el.append(item.render().el);
        },
        render: function () {
            var html = this.template.render();
            this.$el.html(html);

            return this;
        }
    });
});
