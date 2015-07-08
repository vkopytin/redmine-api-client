define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        DropDown = require('views/dropdown'),
        SelectionList = require('views/selectionlist');

    return BaseView.extend({
        initialize: function () {
            BaseView.prototype.initialize.apply(this, arguments);

            this.dropdown = new SelectionList({
                collection: new BB.Collection()
            });

        },
        setSource: function (data) {
            this.dropdown.setSource(data);
        },
        render: function () {

            this.dropdown.setElement(this.$('.queries')).render();

            return this;
        }
    });
});
