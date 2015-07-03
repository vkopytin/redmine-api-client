define(function (require) {
    var _ = require('underscore'),
        BB = require('backbone'),
        StatementModel = require('models/statement'),
	    localStorage = require('localStorage');

    return BB.Collection.extend({
        url: 'data.json',
        urlRoot: '/api/statements',
        localStorage: new BB.LocalStorage('statements'),
        model: StatementModel
    });
});
