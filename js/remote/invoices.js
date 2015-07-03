define(function (require) {
    var BB = require('backbone');

    return BB.Collection.extend({
        url: '/api/invoices'
    });
});
