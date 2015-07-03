define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        MainRouter = require('mainrouter');

    return {
        initialize: function () {
            this.router = new MainRouter({
                app: this
            });

            BB.history.start();
        }
    };
});
