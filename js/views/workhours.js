define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        template = $T.compile(require('text!templates/workhours.tpl.html'));

    var weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return BaseView.extend({
        events: {
            'keyup input': 'updateHours',
            'change input': 'updateHours'
        },
        initialize: function (options) {
            this.manageProperty = options.manageProperty;

            this.model.on('change', this.updateView, this);
        },
        updateView: function (model, options) {
            var options = _.defaults(options, {
                refresh: true
            });
            if (options.refresh && options.forView !== this) {
                this.render();
            }
        },
        updateHours: function (evnt) {
            var index = this.$('input').index(evnt.currentTarget),
                workHours = this.model.get(this.manageProperty),
                daysInMoth = this.getDaysInMonth(2015, this.model.get('workMonthNumber')),
                value = this.$(evnt.currentTarget).val();

            workHours = _.isArray(workHours) ? workHours : _.map(new Array(daysInMoth), function () { return 0; });
            workHours[index] = _.isEmpty(value) ? '' : ~~value;

            this.model.set(this.manageProperty, workHours, {
                refresh: false,
                forView: this
            });
        },
        isLeapYear: function (year) { 
            return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0); 
        },
        getDaysInMonth: function (year, month) {
            return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        render: function () {
            var workHours = this.model.get(this.manageProperty),
                workMonthNumber = this.model.get('workMonthNumber');

            if (_.isEmpty(workMonthNumber)) {
                return ;
            }

            daysInMoth = this.getDaysInMonth(2015, ~~workMonthNumber);
            workHours = _.isArray(workHours) ? workHours : _.map(new Array(daysInMoth), function () { return 0; });

            var workHours = _.map(workHours, function (hours, index) {
                var dayNumber = new Date(2015, workMonthNumber, index + 1).getDay();

                return {
                    value: hours,
                    index: index + 1,
                    dayNumber: dayNumber,
                    day: weekday[dayNumber]
                };
            });
            var weeks = _.reduce(workHours, function (total, item) {
                var items = total[total.length - 1];
                if (item.dayNumber === 6 && item.index !== 1) {
                    total.push({ workHours: [] });
                }

                items.workHours.push(item);
                return total;
            }, [{ workHours: [] }]);
            var weeksFull = [];
            _.each(weeks, function (week, index) {
                weekItem = {workHours: []};
                if (_.isEmpty(week.workHours)) {
                    return;
                }
                _.each([0, 1, 2, 3, 4, 5, 6], function (number) {
                    var hours = _.find(week.workHours, function (item) {
                        return item.dayNumber === number;
                    });
                    if (_.isEmpty(hours)) {
                        hours = {
                            dayNumber: number
                        };
                    }
                    weekItem.workHours.push(hours);
                });
                weeksFull.push(weekItem);
            });
            var html = template.render({
                weeks: weeksFull,
                weekday: _.map([0,1,2,3,4,5,6], function (day) {
                    return weekday[day];
                }),
                color: function () {
                    if (this.value === '') {
                        return "";
                    }
                    else if (this.value === 0) {
                        return "background-color: orange;";
                    }
                    else if (this.value <= 4) {
                        return "background-color: yellow;";
                    }
                    else if (this.value < 8) {
                        return "background-color: lightGreen;";
                    }
                    return "background-color: green;";
                }
            });
            this.$el.empty().html(html);

            return this;
        }
    });
});
