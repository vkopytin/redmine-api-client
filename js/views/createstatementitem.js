define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        template = $T.compile(require('text!templates/createstatementitem.tpl.html')),
        WorkHours = require('views/workhours');

    return BaseView.extend({
        events: {
            'keyup input.field': 'updateModel',
            'click #item-save': 'saveItem',
            'click #item-cancel': 'cancelItem',
            'click .tab-button': 'switchTab'
        },
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.model.on('change', this.updateView, this);
        },
        updateModel: function (evnt) {
            var $el = $(evnt.currentTarget),
                bindInfo = $el.data('bind').split(':'),
                value = $el[bindInfo[1]]();
            
            this.model.set(bindInfo[0], value, {
                refresh: false,
                forView: this
            });
        },
        updateView: function (model, options) {
            var options = _.defaults(options, {
                refresh: true
            });
            if (options.refresh && options.forView !== this) {
                this.render();
            }
        },
        switchTab: function (evnt) {
            var toTab = this.$(evnt.currentTarget).index();
            this.$('.tab-item').hide();

            this.$('.tab-item').eq(toTab).show();
        },
        saveItem: function () {
            this.model.save(null, {
                success: _.bind(this.close, this)
            });
        },
        cancelItem: function () {
            this.close();
        },
        drawWorkHours: function () {
            var view = new WorkHours({
                el: this.$('.work-hours-placeholder'),
                manageProperty: 'workHours',
                model: this.model
            }).render();
        },
        drawPlannedHours: function () {
            var view = new WorkHours({
                el: this.$('.planned-hours-placeholder'),
                manageProperty: 'plannedHours',
                model: this.model
            }).render();
        },
        render: function () {
            var html = template.render(this.model.toJSON());
            this.$el.empty().html(html, this.model.toJSON());

            this.drawWorkHours();
            this.drawPlannedHours();

            return this;
        }
    });
});
