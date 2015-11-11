define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        ViewItem = require('views/redmine/projectitem'),
        IssuesCollection = require('collections/redmine/issues');

    require('jquery.ui');
    require('jquery.mixitup');

    return BaseView.extend({
        events: {
            'sortupdate li.sorting': 'sortUpdate'
        },
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
        uniqId: +new Date(),
        rowTemplate: $T.compile('<ul class="fixed_version" data-id="{{fixed_version.id}}">\
    <li colspan="4" style="text-align:center;background-coloe: #efefef;display:none;"><a href="{{redminePath}}/{{fixed_version.id}}">{{fixed_version.name}}</a></li>\
    </ul><ul class="fixed_version" data-id="{{fixed_version.id}}" id="{{fixed_version.id}}">\
    <li id="{{uid}}-1" class="to-do sorting cat-{{fixed_version.id}}" data-status="feedback" valign="top"></li>\
    <li id="{{uid}}-2" class="in-progress sorting cat-{{fixed_version.id}}" data-status="in progress" valign="top"></li>\
    <li id="{{uid}}-3" class="to-deploy sorting cat-{{fixed_version.id}}" data-status="ready to deploy" valign="top"></li>\
    <li id="{{uid}}-4" class="done sorting cat-{{fixed_version.id}}" data-status="ready to test on live" valign="top"></li></ul>'),
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
                break;
                case 'refreshIssue':
                    this.refreshIssue(value);
                break;
            }
        },
        drawItem: function (model) {
            var el = $('<div/>'),
                item = new ViewItem({
                    viewModel: this.options.viewModel,
                    className: model.get('id'),
                    el: el,
                    model: model,
                    template: $T.compile(this.$('#item-template').html()),
                    bind: {
                        issueChanged: 'selectedIssueId',
                        activateRedmine: 'activateRedmine',
                        statusId: 'statusId'
                    },
                    onViewUpdate: _.bind(function (model, view) {
                        this.sortItems(model, view);
                    }, this)
                });
            item.render();

            //this.sortItems(model, item);
        },
        refreshIssue: function (fields) {
            var issue = this.issues.find(function (model) {
                return model.get('id') === fields.id;
            });

            if (issue) {
                issue.set(fields);
                return true;
            }
        },
        mixItUp: _.debounce(function () {
            $('.sorting').mixItUp({
                layout: {
                    display: 'block',
                    containerClass: '',
                    containerClassFail: 'fail'
                }
            });
            _.delay(function () {
                $('.sorting').mixItUp('sort', 'mix_priority:desc mix_date:asc', true, function () {
                    _.defer(function () {
                    $('li.sorting').sortable({
                        revert: 300,
                        connectWith: 'ul.fixed_version li',
                        change: function(event, ui) {
                            ui.placeholder.css({visibility: 'visible', border : '1px solid green'});
                        }
                    });//.disableSelection();
                    }, 500);
                });
            });
        }, 1000),
        sortItems: function (model, item) {
            var fixed_version = model.get('fixed_version') || {id:'9999', name:'_'},
                statusOrder = this.statusOrder,
                status = model.get('status');

            $fixedVersion = this.$('#'+fixed_version.id);
            if ($fixedVersion.length === 0) {
                $fixedVersion = $(this.rowTemplate.render({
                    fixed_version: fixed_version,
                    uid: this.uniqId++,
                    redminePath: localStorage.getItem('redminePath')
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

            var $fixedVersion = this.$('.fixed_version');
            $fixedVersion.sort(function (a, b) {
                var l = parseInt($(a).data('id')),
                    r = parseInt($(b).data('id'));

                return (l > r) ? 1 : (l < r) ? -1 : 0;
            });
            $fixedVersion.detach().appendTo(this.$('.issues-table'));

            this.mixItUp();
            return ;
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

            //var $fixedVersion = this.$('.fixed_version');
            //$fixedVersion.sort(function (a, b) {
            //    var l = parseInt($(a).data('id')),
            //        r = parseInt($(b).data('id'));

            //    return (l > r) ? 1 : (l < r) ? -1 : 0;
            //});
            //$fixedVersion.detach().appendTo(this.$('.issues-table'));

            $('li.sorting').sortable({
                connectWith: 'ul.fixed_version li',
                change: function(event, ui) {
                    ui.placeholder.css({visibility: 'visible', border : '1px solid green'});
                }
            });//.disableSelection();
        },
        sortUpdate: _.debounce(function (evnt, ui) {
            var $target = $(evnt.currentTarget),
                $el = ui.item;

            $el.trigger('updateStatus', {
                target: $target,
                item: $el
            });
        }, 500),
        loadChildren: function (finish) {
        },
        renderTemplate: function () {
            var html = this.template.render({
                redminePath: localStorage.getItem('redminePath')
            });

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
