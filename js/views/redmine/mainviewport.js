define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        ViewPort = require('views/viewport'),
        $T = require('hogan'),
        template = require('text!templates/redmine/mainviewport.tpl.html'),
        ViewModel = require('viewmodels/mainviewport'),
        ProjectsView = require('views/redmine/projects'),
        SelectionList = require('views/selectionlist'),
        RedmineView = require('views/redmine/redmine'),
        redmineTemplate = require('text!templates/redmine/redmine.tpl.html'),
        SearchView = require('views/searchview'),
        SearchViewModel = require('viewmodels/search'),
        IssuesViewModel = require('viewmodels/issues');

    return ViewPort.extend({
        events: {
            'click .get-issues': 'getIssues',
            'click .load-more': 'loadMore',
            'click .redmine-view-close': 'closeRedmineView'
        },
        template: $T.compile(template),
        initialize: function (options) {
            this.viewModel = options.viewModel;

            ViewPort.prototype.initialize.apply(this, arguments);

            this.bindView(this.viewModel);
        },
        set: function (name, value) {
            switch (name) {
                case 'totalCount':
                    this.$('.issues-total').text(value);
                    break;
                case 'showLoadingOverlay':
                    this.showLoadingOverlay(value);
                    break;
                case 'issuesLoaded':
                    this.$('.issues-loaded').text(value.length);
                    break;
                case 'activateRedmine':
                    this.activateRedmine(value);
                    break;
            }
        },
        getIssues: function () {
            this.viewModel.requestData();
        },
        loadMore: function () {
            this.viewModel.nextPage();
        },
        showLoadingOverlay: function (show) {
            this.$('.loading').toggleClass('hidden', !show);
        },
        activateRedmine: function (issueId) {
            var rmUrl = //localStorage.getItem('redminePath')
                'https://redmine.rebelmouse.com' + '/issues/' + issueId,
                redmineView = this.$('.redmine-view')
                .toggleClass('hidden', false),
                width = redmineView.width(),
                height = redmineView.height();
            this.$('.redmine-view iframe')
                .attr('src', rmUrl)
                .width(width * 4/3)
                .height(height * 4/3)
                .css('margin', '-' + (-20 + height/4.5) + 'px 0 0 -' + (width/6) + 'px');
        },
        closeRedmineView: function (evnt) {
            this.$('.redmine-view')
                .toggleClass('hidden', true);
        },
        render: function () {
            var res = $.Deferred();

            ViewPort.prototype.render.apply(this, arguments);

            _.defer(_.bind(this.getIssues, this), 60);

            res.resolve(this);

            return res.promise();
        }
    });
});
