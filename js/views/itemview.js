define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base');

    return BaseView.extend({
        events: {
            'click': 'clickHandler'
        },
        tagName: 'option',
        template: $T.compile('<a href="#">{{name}}</a>'),
        key: 'identifier',
        clickHandler: function (evnt) {
            evnt && evnt.preventDefault();
            var $el = $(evnt.currentTarget),
                data = {
                    key: $el.data('value')
                };
            this.options.onClick && this.options.onClick.call(this, data);
            this.trigger('change:item',data);
        },
        isSelected: function (model) {
        },
        render: function () {
            if (this.isSelected()) {
                this.$el.attr('selected', true);
            }
            this.$el.val(this.model.get(this.key));
            this.$el.data('value', this.model.get(this.key));
            this.$el.html(this.template.render(this.model.toJSON()));
            return this;
        }
    });

});
