define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        ProjectsCollection = require('collections/redmine/projects'),
        QueriesCollection = require('collections/redmine/queries'),
        IssuesCollection = require('collections/redmine/issues'),
        SelectionList = require('views/selectionlist');

    return BB.Model.extend({
        defaults: {
            offset: 0,
            limit: 100
        },
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
            this.set('offset', 0);
            var url = _.compact(['/redmine', project, this.get('query')]).join('/');
            this.router.navigate(url, {trigger: true});
        },
        changeQuery: function (model, query) {
            this.set('offset', 0);
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
            this.set('totalCount', collection.totalCount);
        },
        getIssuesInternal: function () {
            var project = this.get('project'),
                query = this.get('query'),
                data = {
                    key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88',
                    limit: this.get('limit')
                };

            if (query) {
                data.query_id = query;
            }
            if (this.get('offset')) {
                data.offset = this.get('offset');
            }
            return this.issues.fetch({
                //remove: !this.get('offset'),
                data: data,
                xheaders: {'Authorization': 'Y2hlOmd1ZXZhcmEyMDEyIQ=='}
            });
        },
        getIssues: function () {
            this.set('loading', true);
            this.getIssuesInternal().always(_.bind(function () {
                this.set('loading', false);
            }, this));
        },
        nextPage: function () {
            this.set('offset', this.get('offset') + this.get('limit'));
            this.getIssues();
        },
        requestData: function () {
            this.set('loading', true);
            $.when(
                this.projects.fetch({
                    data: {
                        key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88'
                    }
                }),
                this.queries.fetch({
                    data: {
                        key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88'
                    }
                }),
                this.getIssuesInternal()
            ).always(_.bind(function () {
                this.set('loading', false);
            }, this));
        }
    });
});
