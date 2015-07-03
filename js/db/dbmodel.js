define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        WebSQL = require('db/websql');

    return BB.Model.extend({
        initialize: function (attrs, options) {
            this.websql = options.collection.websql;
        },
        sync: function (method, model, options) {
            switch (method) {
                case 'create':
                    this.insert({
                        data: model.toJSON(),
                        success: function (result) {
                            options.success(result);
                        },
                        error: options.error
                    });
                    break;
                case 'update':
                    this.update({
                        data: model.toJSON(),
                        success: options.success,
                        error: options.error
                    });
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
