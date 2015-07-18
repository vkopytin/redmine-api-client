define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        ViewPort = require('views/viewport'),
        $T = require('hogan'),
        template = require('text!templates/redmine/mainviewport.tpl.html'),
        ViewModel = require('viewmodels/mainviewport'),
        ProjectsView = require('views/redmine/projects'),
        SelectionList = require('views/selectionlist');

    return ViewPort.extend({
        events: {
            'click .get-issues': 'getIssues',
            'click .load-more': 'loadMore'
        },
        template: $T.compile(template),
        initialize: function (options) {
            ViewPort.prototype.initialize.apply(this, arguments);
            this.viewModel = new ViewModel({
                project: options.project,
                query: options.query
            }, options);

            this.projects = new ProjectsView({
                project: this.viewModel.get('project')
            });
            this.queries = new SelectionList({
                key: 'id',
                collection: new BB.Collection(),
                query: this.viewModel.get('query')
            });
        },
        bindView: function () {
            this.projects.on('change:selected', function (project) {
                this.viewModel.set('project', project);
            }, this);
            this.queries.on('change:selected', function (query) {
                this.viewModel.set('query', this.queries.get('selected'));
            }, this);

            this.viewModel.on('change:projects', function () {
                this.projects.set('source', this.viewModel.get('projects'));
            }, this);
            this.viewModel.on('change:queries', function () {
                this.queries.set('source', this.viewModel.get('queries'));
            }, this);

            this.viewModel.on('change:issues', function () {
                this.viewContainer.set('source', this.viewModel.get('issues'));
            }, this);
            this.viewModel.on('change:issues', function () {
                this.$('.issues-loaded').text(this.viewModel.get('issues').length);
            }, this);

            this.viewModel.on('change:loading', function () {
                this.set('showLoadingOverlay', this.viewModel.get('loading'));
            }, this);

            this.viewModel.on('change:totalCount', function () {
                this.set('totalCount', this.viewModel.get('totalCount'));
            }, this);
        },
        set: function (name, value) {
            switch (name) {
                case 'totalCount':
                    this.$('.issues-total').text(value);
                    break;
                case 'showLoadingOverlay':
                    this.showLoadingOverlay(value);
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
        render: function () {
            ViewPort.prototype.render.apply(this, arguments);

            this.projects
                .setElement(this.$('.projects-selector'))
                .render();

            this.queries
                .setElement(this.$('.queries'))
                .render();

            this.bindView();

            _.defer(_.bind(this.getIssues, this), 60);
        }
    });
});
