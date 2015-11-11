define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone');

    return BB.Model.extend({
        defaults: {
            offset: 0,
            limit: 100
        },
        initialize: function (fields, options) {
            var Service = options.service;
            this.projects = Service.getEntity('Projects'),
            this.queries = Service.getEntity('Queries'),
            this.issues = Service.getEntity('Issues');

            this.issues.setProject(this.get('project'));

            this.projects.on('sync', this.setProjects, this);
            this.queries.on('sync', this.setQueries, this);
            this.issues.on('sync', this.setIssues, this);

            this.on('change:project', this.changeProject, this);
            this.on('change:query', this.changeQuery, this);

            this.setProjects(new BB.Collection());
            this.setQueries(new BB.Collection());
            this.setIssues(new BB.Collection());
        },
        changeProject: function (model, project) {
            this.set('offset', 0);
            var url = _.compact(['/redmine', project, this.get('query')]).join('/');
            Backbone.history.navigate(url, {trigger: false});
            this.getIssues();
        },
        changeQuery: function (model, query) {
            this.set('offset', 0);
            var url = _.compact(['/redmine', this.get('project'), query]).join('/');
            Backbone.history.navigate(url, {trigger: false});
            this.getIssues();
        },
        setProjects: function (collection) {
            this.set('projects', collection.toJSON());
            this.trigger('change:projects', this);
        },
        setQueries: function (collection) {
            this.set('queries', collection.toJSON());
            this.trigger('change:queries', this);
        },
        setIssues: function (collection) {
            if (collection instanceof BB.Model) {
                return false;
            }
            this.set('issues', collection.toJSON());
            this.trigger('change:issues', this);
            this.set('totalCount', collection.totalCount);
        },
        getIssuesInternal: function () {
            var project = this.get('project'),
                query = this.get('query'),
                data = {
                    limit: this.get('limit'),
                    include: 'journals'
                };

            if (this.get('offset')) {
                data.offset = this.get('offset');
            }

            return this.issues.getIssues(project, query, data);
        },
        getIssues: function () {
            this.set('loading', true);
            this.getIssuesInternal().always(_.bind(function () {
                this.set('loading', false);
            }, this));
        },
        nextPage: function () {
            this.set('offset', +this.get('offset') + this.get('limit'));
            this.getIssues();
        },
        requestData: function () {
            this.set('loading', true);
            $.when(
                this.projects.fetch({
                    data: {
                        key: localStorage.getItem('rm-key')
                    }
                }),
                this.queries.fetch({
                    data: {
                        key: localStorage.getItem('rm-key')
                    }
                }),
                this.getIssuesInternal()
            ).always(_.bind(function () {
                this.set('loading', false);
            }, this));
        }
    });
});
