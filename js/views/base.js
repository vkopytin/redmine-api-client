define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone');

    return BB.View.extend({
        constructor: function (options) {
            this.options = options || {};
            BB.View.apply(this, arguments);
        },
        initialize: function (options) {
            _.extend(this, _.pick(options, 
				'app'
			));
        },
        getApp: function() {
            return this.app;
        },
        close: function () {
            this.$el.empty();
        }
    });
});
