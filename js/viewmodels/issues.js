define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        Service = require('service'),
        BaseViewModel = require('viewmodels/mainviewport');

    return BaseViewModel.extend({
        initialize: function (fields, options) {
            this.issues = Service.getEntity('Issues');

            this.issues.on('sync', this.setIssues, this);
        },
        set: function () {
            return BaseViewModel.prototype.set.apply(this, arguments);
        },
        get: function () {
            return BaseViewModel.prototype.get.apply(this, arguments);
        },
        setIssues: function (collection) {
            this.set('issues', collection.toJSON());
            this.set('totalCount', collection.totalCount);
        }
    });
});