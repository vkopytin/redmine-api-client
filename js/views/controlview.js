define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        $T = require('hogan'),
        BaseView = require('views/base');

    return BaseView.extend({
        initialize: function () {
            var router = this.options.router,
                viewModelType = this.$el.data('viewmodel'),
                viewName = this.$el.data('view'),
                viewId = this.$el.prop('id'),
                path = viewName.split('/'),
                name = path.join('_'),
                tplPath = this.$el.data('template'),
                ifReady = this.ifReady = $.Deferred(),
                viewModel = this.viewModel;

            this.viewName = name;

            _.has(router, 'view') && router.view.remove();

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

                define(name, deps.concat(templates), function () {
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

                    function getViewModel(props, opts) {
                        if (ViewModel) {
                            return new ViewModel(props, opts);
                        } else {
                            return viewModel;
                        }
                    }

                    return View.extend({
                        initialize: function () {
                            var view = this,
                                args = [].slice.call(arguments, 0),
                                viewModel = getViewModel(this.options, {
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
                ifReady.resolve(name);
            });
        },
        render: function () {
            var router = this.options.router,
                args = this.options.args,
                $el = this.$el;
            this.ifReady.then(function (viewName) {
                require([viewName], function (View) {
                    var opts = _.extend({
                        el: $el,
                        router: router,
                    }, args);
                    router.view = new View(opts);
                    router.view.render();
                });
            });
            return this;
        }
    });
});
