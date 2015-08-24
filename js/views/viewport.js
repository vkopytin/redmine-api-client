define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        BaseView = require('views/base');

    return BaseView.extend({
        initialize: function () {
            BaseView.prototype.initialize.apply(this, arguments);
        },
        renderTemplate: function () {
            var view = this,
                html = this.template.render(
                    this.viewModel ? this.viewModel.toJSON() : {}
                );

			this.$el.html(html);
            return this;
        },
        render: function () {
            var view = this.renderTemplate();

            return this;
        }
    });
});
