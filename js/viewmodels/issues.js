define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        BaseViewModel = require('viewmodels/mainviewport');

    return BaseViewModel.extend({
        initialize: function (fields, options) {
            var Service = this.service = options.service;
            this.issues = Service.getEntity('Issues');

            this.issues.on('sync', this.setIssues, this);

            this.on('change:activateRedmine', this.activateRedmine, this);
            this.on('change:statusId', this.changeStatusId, this);
        },
        set: function () {
            return BaseViewModel.prototype.set.apply(this, arguments);
        },
        get: function () {
            return BaseViewModel.prototype.get.apply(this, arguments);
        },
        setIssues: function (collection) {
            if (collection instanceof BB.Model) {
                this.set('refreshIssue', collection.toJSON());
                return false;
            }
            this.set('issues', collection.toJSON());
            this.trigger('change:issues', this);
            this.set('totalCount', collection.totalCount);
        },
        changeStatusId: function (model) {
            var issueOpts = model.get('statusId'),
                issueId = issueOpts.id,
                issueStatus = issueOpts.status,
                issue = this.issues.get(issueId);

            if (issue) {
                this.service.resolveEntity('collections/redmine/statuses')
                .then(function (statuses) {
                    return statuses.getStatuses();
                })
                .then(function (statuses, data) {
                    var status = statuses.find(function (sm) {
                        var st = sm.get('name');
                            return new RegExp(issueStatus, 'ig').test(st);
                        });
                    return status;
                })
                .then(function (status) {
                    return status && issue.update({
                        status_id: status.id
                    });
                })
                .then(function (model) {
                    model.fetch({
                        data: {
                            include: 'journals'
                        },
                        success: function () {}
                    });
                });;
            } else {
                console.log('Issue id: [' + issueId + '] is not found');
            }
        },
        activateRedmine: function () {
            var Service = this.service,
                viewModel = this;

            Service.resolveEntity('viewmodels/mainviewport').then(function (mainViewport) {

                mainViewport.set('activateRedmine', viewModel.get('activateRedmine'));
            });
        }
    });
});
