define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone');

    return BB.Model.extend({
        url: function () {
            return ['https://che:guevara2012!@redmine.rebelmouse.com/issues', this.get('id') + '.json'].join('/');
        },
        initialize: function (items, options) {
        },
        parse: function (data) {
            if (_.has(data, 'issue')) {
                data.issue.journals.reverse();
                return data.issue;
            }
            return data;
        }
    });
});
