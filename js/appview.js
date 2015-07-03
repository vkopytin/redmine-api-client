define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        template = $T.compile(require('text!templates/app.tpl.html'));

    return BaseView.extend({
        el: 'body',
        template: template,
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);
        },
        renderTemplate: function () {
            var html = template.render({}, {
            });

            this.$el.html(html);
        },
        initChildren: function (finish) {
            var view = this,
                config = this.options.content;

            require([config.path], function (cls) {

                view.content = new cls(_.extend(config, {
                    el: '#content'
                }));
                finish.call(view);
            });
        },
        renderChildren: function () {
            this.content.render();
        },
        render: function () {
            this.renderTemplate();

            this.initChildren(function () {

                this.renderChildren();
            });

            return this;
        }
    });
});
