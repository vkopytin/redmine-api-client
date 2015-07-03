define(function (require) {
    var _ = require('underscore'),
        WebSQL = function () {

            this.initialize.apply(this, arguments);
        };

    _.extend(WebSQL.prototype, {
        defaults: {
            version: '1.0',
            description: 'Default description',
            size: 2 * 1024 * 1024
        },
        initialize: function(options) {
            var args = _.defaults(options, this.defaults);

            this.db = openDatabase(args.database, args.version, args.description, args.size);

            this.structureInit();
        },

        structureInit: function () {
            this.db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS invoices (number unique, fromDate, amount)',
                    [],
                    function (tx, result) {
                    },
                    function (err) {
                        return false; // true - to fails transaction
                    });
            }, function (err) {
                return false; // true - to fail transaction
            });
        },
        query: function (options) {
            options = _.defaults(options, {
                args: [],
                success: _.noop,
                error: _.noop,
                discardChanges: true
            });
            this.db.transaction(function (tx) {
                tx.executeSql(options.request,
                    options.args,
                    function (tx, result) {
                        var res = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            var item = result.rows.item(i);
                            res.push(item);
                        }
                        options.success(res);
                    },
                    function (tx, err) {
                        options.error(err);
                        return options.discardChanges ? false : true; // true - to fails transaction
                    });
            });
        },
        insertQuery: function (options) {
            options = _.defaults(options, {
                args: [],
                success: _.noop,
                error: _.noop,
                discardChanges: true
            });
            this.db.transaction(function (tx) {
                tx.executeSql(options.request,
                    options.args,
                    function (tx, result) {
                        options.success({rowid: result.insertId});
                    },
                    function (tx, err) {
                        options.error(err);
                        return options.discardChanges ? false : true; // true - to fails transaction
                    });
            });
        },
        lastInsertId: function (options) {
            this.query({
                request: 'SELECT last_insert_rowid() as rowid',
                success: options.success
            });
        },
        select: function (options) {
            var count = options.data.count || 10,
                success = options.options.success || _.noop;

            this.db.transaction(function (tx) {
                tx.executeSql('SELECT rowid AS id, * FROM invoices',
                    [],
                    function (tx, result) {
                        var res = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            var item = result.rows.item(i);
                            res.push(item);
                        }
                        success(res);
                    },
                    function (err) {
                        return false; // true - to fails transaction
                    });
            });
        },
        insert: function (options) {
            var success = options.options.success || _.noop,
                error = options.options.error || _.noop

            this.db.transaction(function (tx) {
                var sqlText = 'INSERT INTO invoices (fields) VALUES (args)',
                    fields = _.reduce(_.keys(options.data), function (res, key) {
                        res.values.push(options.data[key]);
                        res.fields.push(key);
                        res.args.push('?');

                        return res;
                    }, {fields: [], values: [], args: []}),
                    sql = sqlText.replace('fields', fields.fields.join(',')).replace('args', fields.args.join(','));

                tx.executeSql(sql,
                    fields.values,
                    function (tx, result) {
                        success({id: result.insertId});
                    },
                    function (tx, err) {
                        error({ code: err.code, message: err.message});
                        return false; // true - to fail transaction
                    });
            });
        },
        update: function (options) {
            var success = options.options.success || _.noop,
                error = options.options.error || _.noop

            this.db.transaction(function (tx) {
                var sqlText = 'UPDATE invoices SET fields WHERE rowid=?',
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

                tx.executeSql(sql,
                    fields.values,
                    function (tx, result) {
                        success(options.data);
                    },
                    function (tx, err) {
                        error({ code: err.code, message: err.message});
                        return false; // true - to fail transaction
                    });
            });
        }
    });

    return WebSQL;
});
