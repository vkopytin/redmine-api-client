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
        buildMetadata: function ($el) {
            var router = this,
                res = $.Deferred(),
                viewModelType = $el.data('viewmodel'),
                typePath = $el.data('type'),
                templatePath = $el.data('template');

            require([templatePath, viewModelType], function (tplText, ViewModel) {
                var template = $T.compile(tplText),
                    meta = $(template.render()),
                    deps = [typePath],
                    templates = [],
                    typeDeps = [],
                    async;

                meta.find('[data-type]').each(function () {
                    var $el = $(this),
                        templatePath = $el.data('template'),
                        typePath = $el.data('type'),
                        moduleName = typePath.replace(/\//g, '_');

                    deps.push(moduleName);
                    templatePath && templates.push($el.data('template'));
                    typeDeps.push({
                        name: $el.prop('id'),
                        type: moduleName,
                        options: $el.data(),
                        templatePath: templatePath
                    });

                    async = $.when(async, router.buildMetadata($el)
                        .then(function (moduleName, deps, extra, typeDeps, ViewModel) {
                            return router.defineModule(moduleName, deps, extra, typeDeps, ViewModel);

                        }));
                    //.then(function (moduleName) {

                    //    return router.createView(moduleName, _.extend({
                    //        el: $el
                    //    }, $el.data()));

                    //}).then(function (view) {

                    //    view.render();

                    //});
                });

                $.when(async).then(function () {
                    res.resolve(typePath.replace(/\//g, '_'), deps, templates, typeDeps, ViewModel);
                });
            });

            return res.promise();
        },
        defineModule: function (moduleName, deps, extra, typeDeps, ViewModel) {
            console.log('Module "' + moduleName + '" defined.');
            define(moduleName, deps.concat(extra), function () {
                var types = [].slice.call(arguments, 0, deps.length),
                    View = types.shift(),
                    initMethods = []; 

                _.each(types, function (TypeInfo, index) {
                    initMethods.push(function (viewModel) {
                        var options = typeDeps[index] ? typeDeps[index].options : {},
                            templateTxt = typeDeps[index] && typeDeps[index].templatePath ? require(typeDeps[index].templatePath) : false,
                            customOptions = _.extend(options,
                                this.options,
                                viewModel.toJSON(), {
                                    viewModel: viewModel,
                                    template: templateTxt ? $T.compile(templateTxt) : false,
                                    bind: options.bind
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
                    viewTypeName: moduleName,
                    initialize: function () {
                        console.log(this.viewTypeName);
                        var view = this,
                            args = [].slice.call(arguments, 0),
                            viewModel = ViewModel ? new ViewModel(this.options, {
                                router: this.options.router
                            }) : this.options.viewModel,
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
    
            return moduleName;
        },
        createView: function (moduleName, args) {
            var opts = _.extend({
                }, args),
                res = $.Deferred();

            require([moduleName], function (View) {
                var view = new View(opts);

                res.resolve(view);
            });

            return res.promise();
        },
        showRedmineInternal: function (project, query, offset) {
            var router = this,
                $el = $('.mainview');

            this.buildMetadata($el)
            .then(function (moduleName, deps, extra, typeDeps, ViewModel) {

                return router.defineModule(moduleName, deps, extra, typeDeps, ViewModel);

            }).then(function (moduleName) {
                return router.createView(moduleName, _.extend({
                    el: $el,
                    router: router,
                    project: project,
                    query: query,
                    offset: offset
                }, $el.data()));
            }).then(function (view) {

                view.render();
            });
        }
    });
});
