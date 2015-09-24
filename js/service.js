define(function (require) {
    var reqistry = {
            Projects: require('collections/redmine/projects'),
            Queries: require('collections/redmine/queries'),
            Issues: require('collections/redmine/issues'),
            Statuses: require('collections/redmine/statuses')
        };

    function Service() {
        var instances = {};

        return {
            getEntity: function (name) {
                var Type = reqistry[name],
                    inst = instances[name];

                if (!inst) {
                    inst = instances[name] = new Type(null, {
                        data: {
                            key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88'
                        }
                    });
                }

                return inst;
            }
        }
    }

    return Service();
});
