define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        ViewPort = require('views/viewport'),
        $T = require('hogan'),
        template = require('text!templates/redmine/mainviewport.tpl.html'),
        ViewModel = require('viewmodels/mainviewport'),
        ProjectsView = require('views/redmine/projects'),
        SelectionList = require('views/selectionlist');

    return ViewPort.extend({
        events: {
            'click .get-issues': 'getIssues',
            'click .load-more': 'loadMore'
        },
        template: $T.compile(template),
        initialize: function (options) {
            ViewPort.prototype.initialize.apply(this, arguments);
        },
        set: function (name, value) {
            switch (name) {
                case 'totalCount':
                    this.$('.issues-total').text(value);
                    break;
                case 'showLoadingOverlay':
                    this.showLoadingOverlay(value);
                    break;
                case 'issuesLoaded':
                    this.$('.issues-loaded').text(value.length);
                    break;
            }
        },
        getIssues: function () {
            this.viewModel.requestData();
        },
        loadMore: function () {
            this.viewModel.nextPage();
        },
        showLoadingOverlay: function (show) {
            this.$('.loading').toggleClass('hidden', !show);
        },
        render: function () {
            ViewPort.prototype.render.apply(this, arguments);

            this.projects
                .setElement(this.$('.projects-selector'))
                .render();

            this.queries
                .setElement(this.$('.queries'))
                .render();

            this.viewContainer
                .setElement(this.$('.container'))
                .render();

            _.defer(_.bind(this.getIssues, this), 60);
        }
    });
});
