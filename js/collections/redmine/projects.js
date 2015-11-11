define(function (require) {
    var BB = require('backbone');

    return BB.Collection.extend({
        url: localStorage.getItem('redminePath') + '/projects.json',
        parse: function (data) {
            return [{
                id: 0,
                name: 'all',
                identifier: 'all'
            }].concat(data.projects);
        }
    });
});
