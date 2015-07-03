define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        dbCollection = require('db/dbcollection'),
        Calendar = require('db/models/calendar');

    return dbCollection.extend({
        model: Calendar,
        initialize: function (models, options, extra) {
            //this.websql = extra.websql;
            //this.dataInit();
        },
        dataInit: function () {
            this.websql.query({
                request: 'CREATE TABLE IF NOT EXISTS calendar (date unique, workhours, rate)',
            });
        },
        select: function (options) {
            options = _.defaults(options, {
                data: {}
            });
            switch (true) {
                case _.has(options.data, 'from') && _.has(options.data, 'till'):
                    this.websql.query({
                        request: 'SELECT rowid AS id, * FROM calendar WHERE date BETWEEN ? AND ?',
                        args: [options.data.from, options.data.till],
                        success: options.success,
                        error: options.error
                    });
                    break;
                default:
                    this.websql.query({
                        request: 'SELECT rowid AS id, * FROM calendar',
                        args: [],
                        success: options.success,
                        error: options.error
                    });
                    break;
            }
        }
    });
});
