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
            this.app = options.app;
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
            var router = this,
                $el = $('.mainview'),
                app = this.app;

            var mainViewportJml = [{
                type: 'views/redmine/mainviewport',
                template: 'text!templates/redmine/mainviewport.tpl.html',
                viewModel: 'viewmodels/mainviewport',
                el: '.mainview',
                name: 'mainview',
                options: {
                    router: router,
                    app: app,
                    project: project,
                    query: query,
                    offset: offset,
                    bind: {
                        issuesLoaded: 'issues',
                        showLoadingOverlay: 'loading',
                        totalCount: 'totalCount'
                    }
                },
                items: [{
                    type: 'views/redmine/projects',
                    viewModel: 'viewmodels/mainviewport',
                    el: '.projects-selector',
                    name: 'projects',
                    options: {
                        project: project,
                        bind: {
                            selected: 'project',
                            source: 'projects'
                        }
                    }
                }, {
                    type: 'views/selectionlist',
                    viewModel: 'viewmodels/mainviewport',
                    el: '.queries',
                    name: 'queries',
                    options: {
                        query: query,
                        key: 'id',
                        bind: {
                            selected: 'query',
                            source: 'queries'
                        }
                    }
                }, {
                    type: 'views/searchview',
                    viewModel: 'viewmodels/search',
                    el: '.search-issues',
                    name: 'search',
                    options: {
                        bind: {
                            search: 'search'
                        }
                    }
                }, {
                    type: 'views/redmine/redmine',
                    template: 'text!templates/redmine/redmine.tpl.html',
                    viewModel: 'viewmodels/issues',
                    el: '.container',
                    name: 'container',
                    options: {
                        bind: {
                            source: 'issues'
                        }
                    }
                }]
            }];

            function requireAsync(path) {
                var res = $.Deferred();

                require([path], function (Type) {
                    res.resolve(Type);
                }, function (err) {
                    res.reject(err);
                });

                return res.promise();
            }

            function renderChildren(items, pView) {
                var service = app.getService(),
                    resAll;
                _.each(items, function (viewInit) {
                    var type = viewInit.type,
                        tpl = viewInit.template,
                        options = viewInit.options,
                        el = viewInit.el,
                        viewModelPath = viewInit.viewModel,
                        propName = viewInit.name;

                    $.when(
                        requireAsync(type),
                        requireAsync(tpl),
                        service.resolveEntity(viewModelPath, options))
                    .then(function (View, template, viewModel) {
                        var viewOpts = _.extend({}, options, {
                                'parent': pView,
                                viewModel: viewModel,
                                service: service,
                                template: $T.compile(template),
                                el: el
                            }),
                            view = new View(viewOpts),
                            res = view.render(),
                            childRes = renderChildren(viewInit.items, view.$el);

                        resAll = $.when(resAll, res, childRes);
                    });
                });

                return resAll;
            }

            $.when(renderChildren(mainViewportJml, this)).then(function () {
                console.log(['rendered: ', arguments]);
            });;
        }
    });
});
