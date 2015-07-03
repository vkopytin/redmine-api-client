define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        $T = require('hogan'),
        BaseView = require('views/base'),
        DropDown = require('views/dropdown'),
        ItemView = require('views/itemview'),
        ProjectsCollection = require('collections/redmine/projects');

    return BaseView.extend({
        initialize: function () {
            var view = this;
            this.projects = new ProjectsCollection();
            this.dropdown = new DropDown({
                ItemView: ItemView.extend({
                    key: 'identifier',
                    isSelected: function () {
                        return view.options.project === this.model.get('identifier')
                    }
                }),
                collection: this.projects,
                selected: this.options.project
            });

            this.dropdown.on('change:item', this.changeProject, this);
        },
        changeProject: function (options) {
            this.options.router.navigate(['/redmine', options.key, this.options.query].join('/'), {trigger: true});
        },
        getProjects: function () {
            this.projects.fetch({
                data: {
                    key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88'
                }
            });
        },
        render: function () {

            this.dropdown.setElement(this.$('.projects')).render();

            _.defer(_.bind(this.getProjects, this), 50);
            return this;
        }
    });
});
