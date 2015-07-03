define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base');

    return BaseView.extend({
        tagName: 'option',
        template: $T.compile('{{name}}'),
        key: 'identifier',
        isSelected: function (model) {
        },
        render: function () {
            if (this.isSelected()) {
                this.$el.attr('selected', true);
            }
            this.$el.val(this.model.get(this.key));
            this.$el.html(this.template.render(this.model.toJSON()));
            return this;
        }
    });

});
