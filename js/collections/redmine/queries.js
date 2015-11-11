define(function (require) {
    var BB = require('backbone');

    return BB.Collection.extend({
        url: localStorage.getItem('redminePath') + '/queries.json',
        parse: function (data) {
            return data.queries;
        }
    });
});
