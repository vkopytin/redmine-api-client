define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        WebSQL = require('db/websql');

        require('collections/statements');
        var webSQL;

    return {
        get: function (name, a, b, c, d, e, f) {
            var path = name.split('/');

            switch (path[0]) {
                case 'db':
                    webSQL = webSQL || new WebSQL({
                        database: 'samples',
                        version: '1.0'
                    });
                    return this.websql.apply(this, arguments);
                    break;
                default:
                    return this.localStorage.apply(this, arguments);
            }
        },
        localStorage: function (name, a, b, c, d, e, f) {
            var ctor = require(name);

            return new ctor(a, b, c, d, e, f);
        },
        websql: function (name, a, b, c, d, e, f) {
            var ctor = require(name);

            var inst = new ctor(a, b, c, d, e, f);
            inst.websql = webSQL;
            return inst;
        }
    };
});
