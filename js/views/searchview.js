define(function (require) {
    var _ = require('underscore'),
        BaseView = require('views/base');

    return BaseView.extend({
        events: {
            'keyup .search-input': 'searchInputHandler'
        },
        initialize: function () {
            return BaseView.prototype.initialize.apply(this, arguments);
        },
        get: function (name) {
            switch (name) {
                case 'search':
                    return this.$('.search-input').val();
            }
        },
        set: function (name, value) {
            switch (name) {
                case 'search':
                    this.$('search-input').val(value);
                    this.trigger('change:search', value);
                break;
            }
        },
        searchInputHandler: _.debounce(function (evnt) {
            evnt && evnt.preventDefault();
            var text = this.$(evnt.currentTarget).val();

            this.trigger('change:search', text);
        }, 500)
    });
});
