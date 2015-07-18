define(function (require) {
    var BB = require('backbone');

    return BB.Collection.extend({
        url: 'https://che:guevara2012!@redmine.rebelmouse.com/projects.json',
        parse: function (data) {
            return data.projects;
        }
    });
});
