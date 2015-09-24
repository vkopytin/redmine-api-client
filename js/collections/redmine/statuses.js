define(function (require) {
    var $ = require('jquery'),
        BB = require('backbone'),
        Model = require('models/redmine/status');

    return BB.Collection.extend({
        model: Model,
        url: function () {
            return ['https://che:guevara2012!@redmine.rebelmouse.com/issue_statuses.json'].join('/');
        },
        initialize: function (items, opts) {
            this.opts = opts;
        },
        parse: function (data) {
            return data.issue_statuses;
        }
    });
});
