define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        BaseView = require('views/base'),
        $T = require('hogan');

    return BaseView.extend({
        events: {
            'keyup #redminePath': 'redminePathHandler',
            'keyup #username': 'usernameHandler',
            'keyup #password': 'passwordHandler',
            'keyup #rm-key': 'rmKeyHandler'
        },
        initialize: function (options) {
            this.template = options.template;
        },
        updateRedminePath: function () {
            var path = [
                window.location.pathname,
                'api.php/',
                localStorage.getItem('username'),
                ':',
                localStorage.getItem('password'),
                ':',
                localStorage.getItem('rm-key'),
                '/'
            ].join('');
            if (path.indexOf('http') === 0) {
                return ;
            } else {
                $('#redminePath').val(path);
                localStorage.setItem('redminePath', path);
            }
        },
        redminePathHandler: function (evnt) {
            evnt && evnt.preventDefault();
            var value = $('#redminePath').val();

            localStorage.setItem('redminePath', value);
        },
        usernameHandler: function (evnt) {
            evnt && evnt.preventDefault();
            var value = $('#username').val();

            localStorage.setItem('username', value);

            this.updateRedminePath();
        },
        passwordHandler: function (evnt) {
            evnt && evnt.preventDefault();
            var value = $('#password').val();

            localStorage.setItem('password', value);

            this.updateRedminePath();
        },
        rmKeyHandler: function (evnt) {
            evnt && evnt.preventDefault();
            var value = $('#rm-key').val();

            localStorage.setItem('rm-key', value);

            this.updateRedminePath();
        },
        render: function () {
            var res  = $.Deferred(),
                data = {
                    redminePath: localStorage.getItem('redminePath'),
                    username: localStorage.getItem('username'),
                    password: localStorage.getItem('password'),
                    'rm-key': localStorage.getItem('rm-key')
                },
                html = this.template.render(data);

            this.$el.html(html);

            res.resolve(this);
            return res;
        }
    });
});
