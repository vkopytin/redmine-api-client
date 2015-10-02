define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone');

    return BB.View.extend({
        constructor: function (options) {
            this.options = _.extend({}, options || {});
            options.viewModel && (this.viewModel = options.viewModel);
            BB.View.apply(this, arguments);
        },
        initialize: function (options) {
            _.extend(this, _.pick(options, 
				'app'
			));
        },
        bindView: function (viewModel) {
            var bind = this.options.bind;
            _.each(bind, function (key, value) {
                var key = key,
                    value = value;
                this.on('change:' + value, function () {
                    viewModel.set(key, this.get(value));
                }, this);
                viewModel.on('change:' + key, function () {
                    this.set(value, viewModel.get(key));
                }, this);
            }, this);
        },
        set: function () {
            console.log(arguments);
        },
        getApp: function() {
            return this.app;
        },
        close: function () {
            this.$el.empty();
        }
    });
});
