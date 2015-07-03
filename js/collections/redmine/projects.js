define(function (require) {
    var BB = require('backbone');

    return BB.Collection.extend({
        url: 'https://redmine.rebelmouse.com/projects.json',
        parse: function (data) {
            return data.projects;
        }
    });
});
