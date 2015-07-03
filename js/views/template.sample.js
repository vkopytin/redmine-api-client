define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base');

    var baseTpl = $T.compile('<div>Title from base</div>\
Full name: {{#fullName}}Oba na{{/fullName}}\
{{#user}}<div>User name:{{\n}}</div>{{/user}}\
{{<base}}\
{{$before}}--before--{{/before}}\
{{$contents}}\
<div>from base</div>\
{{/contents}}\
{{/base}}\
');

    var CustomView = BB.View.extend({
        initialize: function (options) {
        },
        render: {
        }
    });

    var BView = BaseView.extend({
        initialize: function (options) {
            this.control = new CustomView();
        },
        getSubTemplates: function () {
        },
        render: function () {
            this.$el.html(baseTpl.render(_.extend({
                    context: this,
                    user: 'U name',
                    author: 'author'
                }, this.subViews), {
                    base: '{{$before}}{{/before}} {{$contents}}testing again{{/contents}}after'
                }));

            return this;
        }
    });

    var childTpl = $T.compile('from child');
    return BView.extend({
        getSubTemplates: function () {
            return {
                child: childTpl
            };
        },
        render: function () {
            BView.prototype.render.apply(this);

            return this;
        }
    });
});
