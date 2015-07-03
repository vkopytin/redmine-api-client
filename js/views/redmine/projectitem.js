define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base');

        return BaseView.extend({
            initialize: function (options) {
                this.template = options.template;
                BaseView.prototype.initialize.apply(this, arguments);
                this.model.on('change', this.render, this);
            },
            render: function () {
                var html = this.template.render(_.extend(this.model.toJSON(), {
                    color_priority: function () {
                        var priorityColor = {
                            'immediate': 'red',
                            'urgent': 'orange',
                            'high': 'green',
                            'normal': 'blue',
                            'low': 'gray'
                        };
                        return priorityColor[this.priority.name.toLowerCase()];
                    },
                    for_git: function () {
                        return function () {
                            return [this.id, this.subject.toLowerCase().replace(/[:\-\.\,"'*&^\s+]+/g, '_', '_').replace(/^[_]+|[_]+$/g, '')].join('-');
                        }
                    },
                    statusLower: function () {
                        return $.trim(this.status.name).toLowerCase();
                    }
                }));

                this.$el.html(html);

                return this;
            }
        });
});
