define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone');

    function async(body, context) {
        var context = context || this,
            res = $.Deferred(),
            finish = function (ret) {
                res.resolve(ret);
            };

        body.call(context, finish);

        return res.promise();
    }

    return BB.Model.extend({
        url: function () {
            return [localStorage.getItem('redminePath') + '/issues', this.get('id') + '.json?key=' + localStorage.getItem('rm-key')].join('/');
        },
        initialize: function (items, options) {
        },
        parse: function (data) {
            if (_.has(data, 'issue')) {
                data.issue.journals.reverse();
                return data.issue;
            }
            return data;
        },
        update: function (data) {
            var model = this,
                issue = {
                    xissue: data
                };

            return async(function (finish) {
                this.save(null, {
                    data: JSON.stringify(issue),
                    contentType: 'application/json',
                })
                .always(function () {
                    finish(model);
                });
            }, this);
        }
    });
});
