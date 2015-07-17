define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        AppView = require('appview'),
        RR = require('repository');

        require('db/invoices');
        require('db/collections/calendar');

    return BB.Router.extend({
        routes: {
            'statements': 'statements',
            'statement/:id': 'showStatement',
            'invoices': 'invoices',
            'calendar/:name': 'showCalendar',
            'template': 'showTemplate',
            'redmine': 'showRedmine',
            'redmine/:project': 'showRedmineByProject',
            'redmine/:project/:query': 'showRedmineByProjectAndQuery',
            'redmine/:project?offset=:offset': 'showRedmineByProjectAndOffset',
            'redmine/:project/:query?offset=:offset': 'showRedmineByProjectAndQueryAndOffset',
            '*action': 'main'
        },
        initialize: function (options) {
            this.app = options.app;
        },
        showView: function (config) {
            this.currentView && this.currentView.close();
            this.currentView = new AppView(config);

            this.currentView.render();

            !_.isEmpty(this.currentView.collection) && this.currentView.collection.reset();
			
			return this.currentView;
        },
        main: function () {
            this.showView({
                app: this.app,
                content: {
                    path: 'views/main',
                    app: this.app
                }
             });
        },
        statements: function () {
            var statements = RR.get('collections/statements');
            this.showView({
                app: this.app,
                content: {
                    path: 'views/statements',
                    app: this.app,
                    collection: statements
                }
            });
			statements.fetch();
        },
        showStatement: function (id) {
            var statements = RR.get('collections/statements');
            statements.on('sync', function (model) {
                this.showView({
                    content: {
                        path: 'views/statement',
                        app: this.app,
                        model: statements.get(id)
                    }
                });
            }, this);
            statements.fetch();
        },
        invoices: function () {
            var invoices = RR.get('db/invoices');

            this.showView({
                content: {
                    path: 'views/invoices',
                    app: this.app,
                    collection: invoices
                }
            });

            invoices.fetch();
        },
        showCalendar: function (name) {
            var calendars = RR.get('db/collections/calendar');

            this.showView({
                content: {
                    path: 'views/calendar',
                    app: this.app,
                    collection: calendars
                }
            });
        },
        showTemplate: function () {
            this.showView({
                content: {
                    path: 'views/template',
                    app: this.app
                }
            });
        },
        showRedmine: function () {
            this.showRedmineInternal('rebelmouse', '', '');
        },
        showRedmineByProject: function (project) {
            this.showRedmineInternal(project, '', '');
        },
        showRedmineByProjectAndQuery: function (project, query) {
            this.showRedmineInternal(project, query, '');
        },
        showRedmineByProjectAndOffset: function (project, offset) {
            this.showRedmineInternal(project, '', offset);
        },
        showRedmineByProjectAndQueryAndOffset: function (project, query, offset) {
            this.showRedmineInternal(project, query, offset);
        },
        showRedmineInternal: function (project, query, offset) {
            var router = this;
            _.has(router, 'view') && router.view.remove();
            $('body').empty();
            require(['views/redmine/mainviewport'], function (View) {
                router.view = new View({
                    el: $('<div/>').appendTo($('body')),
                    router: router,
                    project: project,
                    query: query,
                    offset: offset
                });
                router.view.render();
            });
        }
    });
});
