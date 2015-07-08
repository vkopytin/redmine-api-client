define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        ItemView = require('views/itemview');
    
    return BaseView.extend({
        tagName: 'ul',
        template: $T.compile(''),
        ItemView: BB.View.extend({
            tagName: 'li',
            template: $T.compile('<div><label>{{name}}</label></div>'),
            events: {
                'click': 'clickHandler'
            },
            initialize: function () {
                this.model.on('change:selected', this.render, this);
            },
            isSelected: function () {
                return !!this.model.get('selected');
            },
            clickHandler: function (evnt) {
                this.model.set('selected', true);
            },
            render: function () {
                this.$el.html(this.template.render(this.model.toJSON()));

                this.$el.toggleClass('current-item', this.isSelected());
                this.$el.attr('selected', this.isSelected());

                return this;
            }
        }),
        initialize: function () {
            BaseView.prototype.initialize.apply(this, arguments);
            this.collection.on('add', this.drawItem, this);
            this.collection.on('change:selected', this.changeItem, this);
        },
        createItemView: function (options) {
            return new (this.options.ItemView || this.ItemView)(options);
        },
        drawItem: function (model) {
            var item = this.createItemView({
                    model: model
                });

            this.$el.append(item.render().el);
        },
        changeItem: function (model) {
            if (this.selectedModel) {
                this.selectedModel.set('selected', false);
            }
            this.selectedModel = model;
            if (model.get('selected')) {
                this.trigger('change:selected', model.get('id'));
            }
        },
        setSource: function (data) {
            var items = _.map(data, function (item) {
                return {
                    id: item.id,
                    name: item.name,
                    selected: item.id == this.options.query
                };
            }, this);
            this.collection.set(items);
            this.selectedModel = this.collection.get(this.options.query);
        },
        render: function () {
            var html = this.template.render({});
            this.$el.html(html);
            
            return this;
        }
    });
});
