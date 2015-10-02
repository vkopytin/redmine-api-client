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
            "ready to deploy",
            "in progress", "in progress of testing",
            "ready for design testing","ready for testing","resolved","live"
        ],
        groups: {
            toDo: ["feedback on live", "review", "feedback", "tested","new","suspended"],
            inProgress: ["in progress of testing", "in progress"],
            toDeploy: ["ready to deploy"],
            done: ["ready for design testing","ready for testing","resolved","live", "ready to test on live"]
        },
        rowTemplate: $T.compile('<tr class="fixed_version" data-id="{{fixed_version.id}}">\
    <td colspan="4" style="border-left: 2px solid gray;border-top: 1px solid silver;text-align:center;"><a href="https://redmine.rebelmouse.com/versions/{{fixed_version.id}}">{{fixed_version.name}}</a></td>\
    </tr><tr class="fixed_version" data-id="{{fixed_version.id}}" id="{{fixed_version.id}}">\
    <td class="to-do sorting" valign="top" style="border-top: 1px solid silver;"></td>\
    <td class="in-progress sorting" valign="top" style="border-top: 1px solid silver;"></td>\
    <td class="to-deploy sorting" valign="top" style="border-top: 1px solid silver;"></td>\
    <td class="done sorting" valign="top" style="border-top: 1px solid silver;"></td></tr>'),
        initialize: function (options) {
            this.template = options.template;
            this.issues = new IssuesCollection([], {
                project: options.project
            });
            BaseView.prototype.initialize.apply(this, arguments);

            this.issues.on('add', this.drawItem, this);

            this.bindView(this.viewModel);
        },
        set: function (name, value) {
            switch (name) {
                case 'source':
                    this.setSource(value);
            }
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

            if ($.inArray(status.name.toLowerCase(), this.groups.toDo) >= 0) {
                this.$('#'+fixed_version.id+' .to-do').append(item.el);
            } else if ($.inArray(status.name.toLowerCase(), this.groups.inProgress) >= 0) {
                this.$('#'+fixed_version.id+' .in-progress').append(item.el);
            } else if ($.inArray(status.name.toLowerCase(), this.groups.toDeploy) >= 0) {
                this.$('#'+fixed_version.id+' .to-deploy').append(item.el);
            } else if ($.inArray(status.name.toLowerCase(), this.groups.done) >= 0) {
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
                var l = parseInt($(a).data('id')),
                    r = parseInt($(b).data('id'));

                return (l > r) ? 1 : (l < r) ? -1 : 0;
            });
            $fixedVersion.detach().appendTo(this.$('.issues-table'));
        },
        loadChildren: function (finish) {
        },
        renderTemplate: function () {
            var html = this.template.render({});

			this.$el.html(html);
            return this;
        },
        setSource: function (data, options) {
            this.issues.set(data, {
                reset: false
            });
        },
        render: function () {
            var view = this.renderTemplate(),
                res = $.Deferred();

            res.resolve(this);

            return res.promise();
        }
    });
});
