define(function (require) {
    var BB = require('backbone');

    return BB.Collection.extend({
        url: function () {
            return ['https://che:guevara2012!@redmine.rebelmouse.com/projects', this.project, 'issues.json'].join('/');
        },
        initialize: function (items, options) {
            this.project = options.project;
        },
        parse: function (data) {
            this.totalCount = data.total_count;
            return data.issues;
        }
    });
});
