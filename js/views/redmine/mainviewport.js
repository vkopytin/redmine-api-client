define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        ViewPort = require('views/viewport'),
        $T = require('hogan'),
        template = require('text!templates/redmine/mainviewport.tpl.html'),
        ProjectsView = require('views/redmine/projects'),
        QueriesView = require('views/redmine/queries'),
        ProjectsCollection = require('collections/redmine/projects'),
        QueriesCollection = require('collections/redmine/queries'),
        IssuesCollection = require('collections/redmine/issues'),
        SelectionList = require('views/selectionlist');

    var ViewModel = BB.Model.extend({
        initialize: function (fields, options) {
            this.router = options.router;
            this.projects = new ProjectsCollection();
            this.queries = new QueriesCollection();
            this.issues = new IssuesCollection([], {
                project: this.get('project')
            });

            this.projects.on('sync', this.setProjects, this);
            this.queries.on('sync', this.setQueries, this);
            this.issues.on('sync', this.setIssues, this);

            this.on('change:project', this.changeProject, this);
            this.on('change:query', this.changeQuery, this);
        },
        changeProject: function (model, project) {
            var url = _.compact(['/redmine', project, this.get('query')]).join('/');
            this.router.navigate(url, {trigger: true});
        },
        changeQuery: function (model, query) {
            var url = _.compact(['/redmine', this.get('project'), query]).join('/');
            this.router.navigate(url, {trigger: false});
            this.getIssues();
        },
        setProjects: function (collection) {
            this.set('projects', collection.toJSON());
        },
        setQueries: function (collection) {
            this.set('queries', collection.toJSON());
        },
        setIssues: function (collection) {
            this.set('issues', collection.toJSON());
        },
        getIssues: function () {
            var project = this.get('project'),
                query = this.get('query'),
                data = {
                    key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88',
                    limit: 100
                };

            if (query) {
                data.query_id = query;
            }
            if (this.get('offset')) {
                data.offset = this.get('offset');
            }
            this.issues.fetch({
                data: data,
                xheaders: {'Authorization': 'Y2hlOmd1ZXZhcmEyMDEyIQ=='}
            });
        },
        requestData: function () {
            this.projects.fetch({
                data: {
                    key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88'
                }
            });
            this.queries.fetch({
                data: {
                    key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88'
                }
            });

            this.getIssues();
        }
    });

    return ViewPort.extend({
        events: {
            'click .get-issues': 'getIssues'
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
                collection: new BB.Collection(),
                query: this.viewModel.get('query')
            });

            this.projects.on('change:selected', this.changeProject, this);
            this.queries.on('change:selected', this.changeQuery, this);

            this.viewModel.on('change:projects', this.projectsSource, this);
            this.viewModel.on('change:queries', this.queriesSource, this);

            this.viewModel.on('change:issues', this.issuesSource, this);
        },
        changeProject: function (project) {
            this.viewModel.set('project', project);
        },
        changeQuery: function (query) {
            this.viewModel.set('query', query);
        },
        projectsSource: function () {
            this.projects.setSource(this.viewModel.get('projects'));
        },
        queriesSource: function () {
            this.queries.setSource(this.viewModel.get('queries'));
        },
        issuesSource: function () {
            this.viewContainer.setSource(this.viewModel.get('issues'), {
                reset: true
            });
        },
        render: function () {
            ViewPort.prototype.render.apply(this, arguments);

            this.projects
                .setElement(this.$('.projects-selector'))
                .render();

            this.queries
                .setElement(this.$('.queries'))
                .render();

            _.defer(_.bind(function () {
                this.viewModel.requestData();
            }, this), 60);
        }
    });
});
