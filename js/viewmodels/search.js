define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone');

    return BB.Model.extend({
        defaults: {
            search: ''
        },
        initialize: function (fields, options) {
            var Service = options.service;
            this.issues = Service.getEntity('Issues');
            this.on('change:search', this.changeSearch, this);
        },
        changeSearch: function (model) {
            this.issues.filter(model.get('search'));
            
        }
    });
});
