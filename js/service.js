define(function (require) {
    var modelTypes = {
            Projects: require('collections/redmine/projects'),
            Queries: require('collections/redmine/queries'),
            Issues: require('collections/redmine/issues'),
            Statuses: require('collections/redmine/statuses')
        },
        viewModelTypes = {
            MainViewport: require('viewmodels/mainviewport'),
            Search: require('viewmodels/search'),
            Issues: require('viewmodels/issues')
        };

    function Service() {
        var models = {},
            viewModels = {},
            entities = {},
            inProgress = {},
            srv;

        return srv = {
            resolveEntity: function (path, options) {
                var inst = entities[path],
                    res = inProgress[path] || $.Deferred();

                if (inst) {
                    return res.resolve(inst);
                } else if (inProgress[path]) {
                    return inProgress[path];
                }

                inProgress[path] = res;
                require([path, 'app'], function (Entity, app) {
                    var inst = entities[path] = new Entity(options, _.extend(options|| {}, {
                        service: srv,
                        app: app,
                        key: localStorage.getItem('rm-key')
                    }));
                    inProgress[path].resolve(inst);
                });

                return inProgress[path].promise();
            },
            getEntity: function (name) {
                var Type = modelTypes[name],
                    inst = models[name];

                if (!inst) {
                    inst = models[name] = new Type(null, {
                        data: {
                            key: localStorage.getItem('rm-key')
                        }
                    });
                }

                return inst;
            },
            getViewModel: function (name) {
                var Type = viewModelTypes[name],
                    inst = viewModels[name];

                if (!inst) {
                    inst = viewModels[name] = new Type();
                }

                return inst;
            }
        }
    }

    return Service();
});
