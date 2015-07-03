define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        template = $T.compile(require('text!templates/calendar.tpl.html'));

    var weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var ViewModel = BB.Model.extend({
    });

    return BaseView.extend({
        events: {
            'keyup input': 'updateHours',
            'change input': 'updateHours',
            'click .save-item': 'saveItems',
            'change .month': 'updateMonth'
        },
        initialize: function (options) {
            this.manageProperty = options.manageProperty;

            this.viewModel = new ViewModel({
                currentMonth: '2015-1'
            });

            this.collection.on('change', this.updateView, this);
            this.viewModel.on('change:currentMonth', this.changeMonth, this);
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
                date = this.$(evnt.currentTarget).data('date'),
                model = this.collection.findWhere({
                    date: this.normalizeDate(date)
                }),
                value = this.$(evnt.currentTarget).val();

            model = model || this.collection.create({
                date: this.normalizeDate(date),
                rate: 1
            }, {
                refresh: false,
                forView: this
            });

            if (model.get('workhours') === value) {
                return false;
            }

            model.set('workhours', value, {
                refresh: false,
                silent: true,
                forView: this
            });
        },
        updateMonth: function (evnt) {
            var $el = this.$(evnt.currentTarget),
                value = $el.val();

            this.viewModel.set('currentMonth', value);
        },
        changeMonth: function (month) {
            this.render(true);
        },
        isLeapYear: function (year) { 
            return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0); 
        },
        getDaysInMonth: function (year, month) {
            return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        saveItems: function (evnt) {
            this.collection.each(function (model) {
                if (model.hasChanged()) {
                    model.save();
                }
            });
        },
        normalizeDate: function (strDate) {
            var date = strDate.split('-');
            return [date[0], ('0' + date[1]).substr(-2), ('0' + date[2]).substr(-2)].join('-');
        },

        showMonth: function (month) {
            var view = this,
                monthYear = month.split('-'),
                workMonthNumber = ~~monthYear[1],
                workYear = ~~monthYear[0];

            daysInMoth = this.getDaysInMonth(2015, ~~workMonthNumber - 1);
            var workHours = _.map(_.range(1, daysInMoth + 1), function (dayNumber) {
                var date = this.normalizeDate([workYear, workMonthNumber, dayNumber].join('-'));
                var model = this.collection.findWhere({date: date});
                return model && model.get('workhours') || '';
            }, this);

            workHours = _.map(workHours, function (hours, index) {
                var dayNumber = new Date(workYear, workMonthNumber - 1, index + 1).getDay();

                return {
                    value: hours,
                    index: index + 1,
                    dayNumber: dayNumber,
                    day: weekday[dayNumber]
                };
            });
            var weeks = _.reduce(workHours, function (total, item) {
                var items = total[total.length - 1];
                if (item.dayNumber === 6 && item.index !== 0) {
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
                cm: function () {
                    var a = {};
                    a[view.viewModel.get('currentMonth')] = true;
                    return a;
                },
                date: function () {
                    return [workYear, workMonthNumber, this.index].join('-');
                },
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
        },
        render: function (reset) {
            var month = this.viewModel.get('currentMonth'),
                daysInMonth = this.getDaysInMonth(-1 + month.split('-')[1]);

            this.collection.fetch({
                reset: reset || false,
                data: {
                    from: this.normalizeDate(month + '-01'),
                    till: this.normalizeDate(month + '-' + daysInMonth)
                },
                success: _.bind(function () {
                    this.showMonth(month);
                }, this)
            });
            return this;
        }
    });
});
