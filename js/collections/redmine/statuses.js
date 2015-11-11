define(function (require) {
    var $ = require('jquery'),
        BB = require('backbone'),
        Model = require('models/redmine/status');

    return BB.Collection.extend({
        model: Model,
        url: function () {
            return [localStorage.getItem('redminePath') + '/issue_statuses.json'].join('/');
        },
        initialize: function (items, opts) {
            this.opts = opts;
        },
        parse: function (data) {
            return data.issue_statuses;
        },
        getStatuses: function () {
            var res = $.Deferred();

            this.fetch({
                data: {
                    key: this.opts.key
                },
                success: function (collection) {
                    res.resolve(collection);
                }
            });

            return res.promise();
        }
    });
});
