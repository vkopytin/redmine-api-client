define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        EditItemView = require('views/createstatementitem'),
        template = $T.compile(require('text!templates/statementitemview.tpl.html'));

    return BaseView.extend({
		tagName: 'li',
		attributes: {
			style: 'margin: 10 5;list-style-type: none;'
		},
        events: {
            'click .edit-item': 'editItem'
        },
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.model.on('sync', this.render, this);
        },
        editItem: function () {
            var view = new EditItemView({
                el: this.$('.edit-item-placeholder'),
                model: this.model
            }).render();
        },
        render: function () {
			var summary = {
					workHoursTotal: 0,
					workDaysTotal: 0,
					plannedHoursTotal: 0,
					plannedDaysTotal: 0
				},
				modelData = this.model.toJSON(),
				data = {};
				
			summary = _.reduce(modelData.workHours, function (summary, hours) {
				summary.workHoursTotal += ~~hours;
				summary.workDaysTotal += (~~hours === 0 ? 0 : 1);
					
				return summary;
			}, summary);
			summary = _.reduce(modelData.plannedHours, function (summary, hours) {
				summary.plannedHoursTotal += ~~hours;
				summary.plannedDaysTotal += (~~hours === 0 ? 0 : 1);
					
				return summary;
			}, summary);
			
			data = _.extend(modelData, summary, {
				calculatedTotal: modelData.monthRate / summary.plannedHoursTotal * summary.workHoursTotal
			});
				
            var html = template.render(_.extend(data, {
            	decimal: function () {
					var ctx = this;
            		return function (value) {
						var val = parseFloat(this[value]);
						return val.toFixed(2);
					};
            	}
            }));
            this.$el.empty().html(html);
            return this;
        }
    });
});
