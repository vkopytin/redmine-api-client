define(function (require) {
    var ViewPort = require('views/viewport'),
        $T = require('hogan'),
        template = require('text!templates/redmine/mainviewport.tpl.html'),
        ProjectsView = require('views/redmine/projects'),
        QueriesView = require('views/redmine/queries');

    return ViewPort.extend({
        events: {
            'click .get-issues': 'getIssues'
        },
        template: $T.compile(template),
        initialize: function (options) {
            ViewPort.prototype.initialize.apply(this, arguments);
            this.projects = new ProjectsView({
                router: options.router,
                project: options.project,
                query: options.query
            });
            this.queries = new QueriesView({
                router: options.router,
                project: options.project,
                query: options.query
            });
        },
        getIssues: function () {
            //this.viewContainer.getIssues();
        },
        render: function () {
            ViewPort.prototype.render.apply(this, arguments);

            this.projects
                .setElement(this.$('.projects-selector'))
                .render();

            this.queries
                .setElement(this.$('.queries-selector'))
                .render();
        }
    });
});
