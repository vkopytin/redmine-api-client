define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        WebSQL = require('db/websql');

    return BB.Collection.extend({
        initialize: function (options) {
            this.websql = options.websql;
        },
        sync: function (method, model, options) {
            switch (method) {
                case 'create':
                    break;
                case 'read':
                        this.select(options);
                    break;
                case 'update':
                    break;
                case 'delete':
                    break;
                default:
                    throw 'Unsupported method: ' + method + '.';
                    break;
            }
        },
        select: _.noop,
        insert: _.noop,
        update: _.noop,
        remove: _.noop
    });
});
