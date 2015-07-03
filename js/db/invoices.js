define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        dbCollection = require('db/dbcollection'),
        Invoice = require('db/models/invoice');

    return dbCollection.extend({
        sql: {
            select: 'SELECT rowid AS id, * FROM invoices',
            insert: 'INSERT INTO invoices (fields) VALUES (args)',
            update: 'UPDATE invoices SET fields WHERE rowid=?',
            remove: ''
        },
        model: Invoice,
        initialize: function (options) {
        },
        select: function (options) {
            this.websql.query({
                request: 'SELECT rowid AS id, * FROM invoices',
                args: [],
                success: options.success,
                error: options.error
            });
        }
    });
});
