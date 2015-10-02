define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base');

        return BaseView.extend({
            events: {
                'click .show-description': 'toggleDescription',
                'click .show-comments': 'showComments',
                'click': 'clickHandler'
            },
            initialize: function (options) {
                this.template = options.template;
                BaseView.prototype.initialize.apply(this, arguments);
                this.model.on('change', this.render, this);
                this.model.on('remove', this.remove, this);
            },
            clickHandler: function (evnt) {
                this.options.onChangeSelected && this.options.onChangeSelected(this, this.model.get('id'));
            },
            select: function (value) {
                this.$('.rm-issue').toggleClass('issue-selected', value);
            },
            toggleDescription: function (evnt) {
                evnt && evnt.preventDefault();
                this.$('.description').toggleClass('hidden');
            },
            showComments: function (evnt) {
                evnt && evnt.preventDefault();
                if (!this.$('.comments-list').hasClass('hidden')) {
                    this.$('.comments-list').toggleClass('hidden');
                    return ;
                }

                this.model.fetch({
                    data: {
                        key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88',
                        include: 'journals'
                    },
                    success: _.bind(function (model) {
                        _.each(model.get('journals'), function (item) {
                        }, this);
                        this.$('.comments-list').toggleClass('hidden');
                    }, this)
                });
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
