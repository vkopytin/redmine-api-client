define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        DropDown = require('views/dropdown'),
        ItemView = require('views/itemview'),
        QueriesCollection = require('collections/redmine/queries');

    return BaseView.extend({
        initialize: function () {
            var view = this;
            this.queries = new QueriesCollection();
            this.dropdown = new DropDown({
                ItemView: ItemView.extend({
                    key: 'id',
                    isSelected: function () {
                        return view.options.query == this.model.get('id')
                    }
                }),
                collection: this.queries
            });

            this.dropdown.on('change:item', this.changeQuery, this);
        },
        changeQuery: function (options) {
            this.options.router.navigate(['/redmine', this.options.project, options.key].join('/'), {trigger: true});
        },
        getQueries: function () {
            this.queries.fetch({
                data: {
                    key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88'
                }
            });
        },
        render: function () {

            this.dropdown.setElement(this.$('.queries')).render();

            _.defer(_.bind(this.getQueries, this), 50);
            return this;
        }
    });
});
