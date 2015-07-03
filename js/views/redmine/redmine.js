define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        ViewItem = require('views/redmine/projectitem'),
        IssuesCollection = require('collections/redmine/issues');

    $.ajaxSetup({
        xheaders: {
            'Authorization': 'Basic Y2hlOmd1ZXZhcmEyMDEyIQ==',
            'X-custom': 'check'
        }
    });

    return BaseView.extend({
        statusOrder: [
            "review", "feedback", "tested","new","suspended",
            "in progress",
            "ready for design testing","ready for testing","ready to deploy","resolved","live"
        ],
        rowTemplate: $T.compile('<tr class="fixed_version" id="{{fixed_version.id}}">\
    <td style="border-left: 2px solid gray;border-top: 1px solid silver;"><a href="https://redmine.rebelmouse.com/versions/{{fixed_version.id}}">{{fixed_version.name}}</a></td>\
    <td class="to-do sorting" valign="top" style="border-top: 1px solid silver;"></td>\
    <td class="in-progress sorting" valign="top" style="border-top: 1px solid silver;"></td>\
    <td class="done sorting" valign="top" style="border-top: 1px solid silver;"></td></tr>'),
        initialize: function (options) {
            this.template = options.template;
            this.issues = new IssuesCollection([], {
                project: options.project
            });
            BaseView.prototype.initialize.apply(this, arguments);

            this.issues.on('add', this.drawItem, this);
            options.viewPort.$el.on('click', '.get-issues', _.bind(this.getIssues, this));
        },
        getIssues: function () {
            var data = {
                    key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88',
                    limit: 100
                };

            if (this.options.query) {
                data.query_id = this.options.query;
            }
            if (this.options.offset) {
                data.offset = this.options.offset;
            }
            this.issues.fetch({
                data: data,
                xheaders: {'Authorization': 'Y2hlOmd1ZXZhcmEyMDEyIQ=='}
            });
        },
        drawItem: function (model) {
            var el = $('<div/>'),
                statusOrder = this.statusOrder,
                fixed_version = model.get('fixed_version') || {id:'9999', name:'_'},
                status = model.get('status'),
                item = new ViewItem({
                    className: model.get('id'),
                    el: el,
                    model: model,
                    template: $T.compile(this.$('#item-template').html())
                }),
                $fixed_version;
            item.render();

            $fixedVersion = this.$('#'+fixed_version.id);
            if ($fixedVersion.length === 0) {
                $fixedVersion = $(this.rowTemplate.render({
                    fixed_version: fixed_version
                }));
                this.$('.issues-table').append($fixedVersion);
            }

            if ($.inArray(status.name.toLowerCase(), ["feedback on live", "review", "feedback", "tested","new","suspended"]) >= 0) {
                this.$('#'+fixed_version.id+' .to-do').append(item.el);
            } else if ($.inArray(status.name.toLowerCase(), ["in progress"]) >= 0) {
                this.$('#'+fixed_version.id+' .in-progress').append(item.el);
            } else if ($.inArray(status.name.toLowerCase(), ["ready for design testing","ready for testing","ready to deploy","resolved","live", "ready to test on live"]) >= 0) {
                this.$('#'+fixed_version.id+' .done').append(item.el);
            } else {
                console.log('Unexpected status: '+ status.name);
            }

            this.$('.sorting').each(function (index, el) {
                var $elements = $(el).children()

                $elements.sort(function (a, b) {
                    var contentA = parseInt($(a).children().data('sort-priority'));
                    var contentB = parseInt($(b).children().data('sort-priority'));
                    var statusA = $(a).children().data('sort-status');
                    var statusOrderA = $.inArray(statusA, statusOrder);
                    var statusB = $(b).children().data('sort-status');
                    var statusOrderB = $.inArray(statusB, statusOrder);
                    var dateA = new Date($(a).children().data('sort-date'));
                    var dateB = new Date($(b).children().data('sort-date'));
                    if (contentA > contentB) {
                        return -1;
                    } else if (contentA < contentB) {
                        return 1;
                    } else if (statusOrderA > statusOrderB) {
                        return 1;
                    } else if (statusOrderA < statusOrderB) {
                        return -1;
                    } else if (dateA > dateB) {
                        return -1;
                    } else if (dateA < dateB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                $elements.detach().appendTo($(el));
            });

            var $fixedVersion = this.$('.fixed_version');
            $fixedVersion.sort(function (a, b) {
                var l = parseInt($(a).attr('id')),
                    r = parseInt($(b).attr('id'));

                return (l > r) ? 1 : (l < r) ? -1 : 0;
            });
            $fixedVersion.detach().appendTo(this.$('.issues-table'));
        },
        loadChildren: function (finish) {
        },
        renderChildren: function () {
        },
        renderTemplate: function () {
            var html = this.template.render({});

			this.$el.html(html);
            return this;
        },
        render: function () {
            var view = this.renderTemplate();

            this.loadChildren(function (view) {
                view.render();
            });

            _.defer(_.bind(this.getIssues, this), 50);

            return this;
        }
    });
});
