define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        Service = require('service');

    return BB.Model.extend({
        defaults: {
            search: ''
        },
        initialize: function () {
            this.issues = Service.getEntity('Issues');
            this.on('change:search', this.changeSearch, this);
        },
        changeSearch: function (model) {
            this.issues.filter(model.get('search'));
            
        }
    });
});
