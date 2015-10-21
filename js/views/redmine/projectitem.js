define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base');

        return BaseView.extend({
            statusOrder: [
                "review", "feedback", "tested","new","suspended",
                "ready to deploy",
                "in progress", "in progress of testing",
                "ready for design testing","ready for testing","resolved","live"
            ],
            events: {
                'click .show-description': 'toggleDescription',
                'click .show-comments': 'showComments',
                'click': 'clickHandler',
                'click .issue-summary': 'showRedmine',
                'mousedown .issue-summary': 'mousedownHandler',
                'mousedown .git-branch': 'mousedownHandler',
                'updateStatus': 'sortUpdate'
            },
            initialize: function (options) {
                this.template = options.template;
                BaseView.prototype.initialize.apply(this, arguments);
                this.model.on('change', this.render, this);
                this.model.on('remove', this.remove, this);

                this.bindView(this.viewModel);
            },
            set: function (name, value) {
                switch (name) {
                    case 'issueChanged':
                        this.select(value === this.model.get('id'));
                    break;
                    case 'activateRedmine':
                    break;
                    default:
                        console.log('Unsupportedt property: ' + name);
                    break;
                }
            },
            get: function (name) {
                switch (name) {
                    case 'issueChanged':
                        return this.model.get('id');
                    break;
                    case 'activateRedmine':
                        return this.model.get('id');
                    break;
                    case 'statusId':
                        return {id: this.model.get('id'), status: this.model.get('statusId')};
                    break;
                    default:
                        console.log('Unsupportedt property: ' + name);
                    break;
                }
            },
            clickHandler: function (evnt) {
                evnt && evnt.preventDefault();
                this.trigger('change:issueChanged', this.model.get('id'));
            },
            mousedownHandler: function (evnt) {
                evnt && evnt.stopPropagation();
            },
            showRedmine: function (evnt) {
                evnt && evnt.preventDefault();
                this.trigger('change:activateRedmine', this.model.get('id'));
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
                        key: localStorage.getItem('rm-key'),
                        include: 'journals'
                    },
                    success: _.bind(function (model) {
                        _.each(model.get('journals'), function (item) {
                        }, this);
                        this.$('.comments-list').toggleClass('hidden');
                    }, this)
                });
            },
            sortUpdate: function (evnt, opts) {
                var $target = opts.target;

                this.model.set('statusId', $target.data('status'));

                this.trigger('change:statusId', this.model.get('id'), $target.data('status'));
                console.log($target.data('status'));
            },
            renderInternal: function () {
                var view = this,
                    data = this.model.toJSON(),
                    html = this.template.render(_.extend(data, {
                    redminePath: 'https://redmine.rebelmouse.com',//localStorage.getItem('redminePath'),
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
                    },
                    mix_priority: function () {
                        var content = parseInt(this.priority.id);
                        return content;
                    },
                    mix_updated_on: function () {
                        var date = +new Date(this.updated_on);
                        return date;
                    },
                    mix_status: function () {
                        var status = $.trim(this.status.name).toLowerCase();
                        var statusOrder = $.inArray(status, view.statusOrder);
                        return statusOrder;
                    }
                }));
                var status = $.trim(data.status.name).toLowerCase();
                var statusOrder = $.inArray(status, view.statusOrder);
                this.$el.toggleClass('mix sort', true);
                this.$el.attr({
                    'data-mix_priority': parseInt(data.priority.id),
                    'data-mix_date': +new Date(data.updated_on),
                    'data-mix_status': statusOrder//,
                    //'data-filter': '.cat-' + (data.fixed_version ? data.fixed_version.id : '9999')
                });
                //this.$el.hide();

                this.$el.html(html);
            },
            render: function () {
                this.renderInternal();

                this.options.onViewUpdate && this.options.onViewUpdate(this.model, this);

                return this;
            }
        });
});
