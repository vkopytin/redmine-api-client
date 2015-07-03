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
                html = this.template.render({});

			this.$el.html(html);
            return this;
        },
        render: function () {
            var view = this.renderTemplate(),
                container = this.$('.container'),
                moduleType = container.data('type'),
                moduleTemplate = container.data('template');

            require(['hogan', moduleType, moduleTemplate], function ($T, ViewContainer, Template) {
                var options = _.extend(view.options, {
                    viewPort: view,
                    el: container,
                    router: view.router
                });
                if (!_.isEmpty(Template)) {
                    options.template = $T.compile(Template);
                }
                view.viewContainer = new ViewContainer(options);
                view.viewContainer.render();
            });

            return this;
        }
    });
});
