define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        dbModel = require('db/dbmodel'),
        WebSQL = require('db/websql');

    return dbModel.extend({
        idAttribute: 'id',
        insert: function (options) {
            var sqlText = 'INSERT INTO calendar (fields) VALUES (args)',
                fields = _.reduce(_.keys(options.data), function (res, key) {
                    res.values.push(options.data[key]);
                    res.fields.push(key);
                    res.args.push('?');

                    return res;
                }, {fields: [], values: [], args: []}),
                sql = sqlText.replace('fields', fields.fields.join(',')).replace('args', fields.args.join(','));
            this.websql.insertQuery({
                request: sql,
                args: fields.values,
                success: _.bind(function (result) {
                    //options.success({id: result.rowid});
                    //return;
                    this.websql.query({
                        request: 'SELECT rowid AS id, * FROM calendar WHERE rowid = ?',
                        args: [result.rowid],
                        success: function (items) {
                            options.success(items[0]);
                        }
                    });
                }, this),
                error: options.error,
                discardChanges: true
            });
        },
        update: function (options) {
            var sqlText = 'UPDATE calendar SET fields WHERE rowid=?',
                fields = _.reduce(_.keys(options.data), function (res, key) {
                    if (key === 'id') {
                        return res;
                    }
                    res.values.push(options.data[key]);
                    res.fields.push(key + '=?');

                    return res;
                }, {fields: [], values: []}),
                sql = sqlText.replace('fields', fields.fields.join(','));

            fields.values.push(options.data.id);

            this.websql.query({
                request: sql,
                args: fields.values,
                success: options.success,
                error: options.error,
                discardChanges: true
            });
        }
    });
});
