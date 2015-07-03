define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        template = $T.compile(require('text!templates/statement.tpl.html'));

    return BaseView.extend({
        initialize: function (options) {
			BaseView.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var html = template.render(this.model.toJSON());
            this.$el.empty().html(html);
			
            return this;
        }
    });
});
