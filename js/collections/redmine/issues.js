define(function (require) {
    var $ = require('jquery'),
        BB = require('backbone'),
        Model = require('models/redmine/issue');

    return BB.Collection.extend({
        model: Model,
        url: function () {
            return ['https://che:guevara2012!@redmine.rebelmouse.com/issues.json'].join('/');
        },
        initialize: function (items, opts) {
            this.opts = opts;
        },
        setProject: function (name) {
            this.project = name;
        },
        filter: function (text) {
            var res = $.Deferred(),
                filtered = [];
            if (text) {
                filtered = _.filter(this.fetchedItems, function (model) {
                    return new RegExp(text, 'gi').test(model.status.name);
                });
                this.reset(filtered);
                this.trigger('sync', this);
                res.resolve(filtered);
                return res.promise();
            } else {
                return this.fetch(this.fetchOpts).then(_.bind(function () {
                    this.fetchedItems = this.toJSON();
                }, this));
            }
        },
        parse: function (data) {
            this.totalCount = data.total_count;
            return data.issues;
        },
        getIssues: function (project, query, opts) {
            var data = this.opts.data || {},
                project = project || this.project,
                data = _.extend({
                }, data, opts);

            if (project && project !== 'all') {
                data.project_id = project;
            }

            if (query) {
                data.query_id = query;
            }

            this.fetchOpts = {
                remove: !data.offset,
                data: data
            };

            return this.fetch(this.fetchOpts).then(_.bind(function () {
                this.fetchedItems = this.toJSON();
            }, this));
        }
    });
});
