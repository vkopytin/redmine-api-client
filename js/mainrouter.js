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
            var router = this,
                viewModelType = 'viewmodels/mainviewport',
                path = 'views/redmine/mainviewport'.split('/'),
                tplPath = 'text!templates/redmine/mainviewport.tpl.html';

            _.has(router, 'view') && router.view.remove();
            $('body').empty();

            require([tplPath, viewModelType], function (tplText, ViewModel) {
                var template = $T.compile(tplText),
                    meta = $(template.render()),
                    deps = [path.join('/')],
                    templates = [],
                    typeDeps = [];

                meta.find('[data-type]').each(function () {
                    var $el = $(this),
                        templatePath = $el.data('template'),
                        typePath = $el.data('type');

                    deps.push(typePath);
                    templatePath && templates.push($el.data('template'));
                    typeDeps.push({
                        name: $el.prop('id'),
                        type: typePath,
                        options: $el.data(),
                        templatePath: templatePath
                    });
                });

                define(path.join('_'), deps.concat(templates), function () {
                    var types = [].slice.call(arguments, 0, deps.length),
                        View = types.shift();
                        initMethods = []; 

                    _.each(types, function (TypeInfo, index) {
                        initMethods.push(function (viewModel) {
                            var options = typeDeps[index] ? typeDeps[index].options : {},
                                templateTxt = typeDeps[index] && typeDeps[index].templatePath ? require(typeDeps[index].templatePath) : false,
                                customOptions = _.extend(options,
                                    this.options,
                                    viewModel.toJSON(), {
                                        template: templateTxt ? $T.compile(templateTxt) : false
                                    }
                                ),
                                inst = new TypeInfo(options),
                                propName = typeDeps[index] ? typeDeps[index].name : false;

                            if (propName) {
                                this[propName] = inst;
                            }

                            return inst;
                        });
                    });

                    return View.extend({
                        initialize: function () {
                            var view = this,
                                args = [].slice.call(arguments, 0),
                                viewModel = new ViewModel(this.options, {
                                    router: router
                                }),
                                subViews = [];

                            _.each(initMethods, function (func) {
                                subViews.push(func.apply(view, [viewModel]));
                            });
                            this.viewModel = viewModel;

                            View.prototype.initialize.apply(view, args);

                            this.bindView(this.viewModel);
                        }
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
            });
        }
    });
});
