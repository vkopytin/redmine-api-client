define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan');

    return BB.Router.extend({
        routes: {
            'redmine': 'showRedmine',
            'redmine/:project': 'showRedmineByProject',
            'redmine/:project/:query': 'showRedmineByProjectAndQuery',
            'redmine/:project?offset=:offset': 'showRedmineByProjectAndOffset',
            'redmine/:project/:query?offset=:offset': 'showRedmineByProjectAndQueryAndOffset',
            '*action': 'showRedmine'
        },
        initialize: function (options) {
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
            var path = 'views/redmine/mainviewport'.split('/');
            define(path.join('_'), [path.join('/')], function (View) {
                return View.extend({
                });
            });
            require([path.join('_')], function (View) {
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
