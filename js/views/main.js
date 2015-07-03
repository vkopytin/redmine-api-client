define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        template = $T.compile(require('text!templates/mainview.tpl.html')),
        RR = require('repository'),

        ViewModel = BB.View.extend.call(function () {
        }, _.extend({}, BB.Events, {
            constructor: function (options) {
                this.options = options;
                this._statements = RR.get('collections/statements');
            },
            load: function () {
            },
            statements: function () {
                this._statements.fetch();
                return this._statements;
            },
            currentModel: function () {
                return this._statements.first();
            }
        }));

    return BaseView.extend({
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);
            this.viewmodel = new ViewModel(options);
        },
        getProp: function (name) {
            var props = this.viewmodel;

            return (name in props) ? props[name].call(props) : undefined;
        },
        loadChildren: function (finish) {
            var view = this;

            this.$('[data-path]').each(function (index, el) {
                var $el = $(el);
                require([$el.data('path')], function (cls) {
                    var propName = $el.prop('id'),
                        config = {
                            el: '#' + propName
                        };
                    _.each($el.data(), function (value, key) {
                        config[key] = view.getProp(value);
                    });
                    view[propName] = new cls(config);
                    finish.call(view, view[propName]);
                });
            });
        },
        renderChildren: function () {
        },
        render: function () {
            var html = template.render({});

			this.$el.html(html);

            this.loadChildren(function (view) {
                this.$(view.el).replaceWith(view.render().el);
            });

            return this;
        }
    });
});
