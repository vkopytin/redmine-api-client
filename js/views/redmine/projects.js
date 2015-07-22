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
                    key: 'id',
                    isSelected: function () {
                        return view.options.project === this.model.get('id')
                    }
                }),
                collection: this.projects,
                selected: this.options.project
            });

            this.dropdown.on('change:item', this.changeProject, this);
        },
        set: function (name, value) {
            switch (name) {
                case 'source':
                    this.setSource(value);
            }
        },
        get: function (name) {
            switch (name) {
                case 'selected':
                    return this.selectedId;
            }
        },
        changeProject: function (options) {
            this.selectedId = options.key;
            this.trigger('change:selected', options.key);
        },
        getProjects: function () {
            this.projects.fetch({
                data: {
                    key: '480190b02690dc9b3ac2a2e68ae34c13961d1b88'
                }
            });
        },
        setSource: function (data) {
            var items = _.map(data, function (item) {
                return {
                    id: item.identifier,
                    name: item.name,
                    selected: item.identifier == this.options.project
                };
            }, this);
            this.projects.set(items);
            this.selectedId = this.options.project;
        },
        render: function () {

            this.dropdown.setElement(this.$('.projects')).render();

            //_.defer(_.bind(this.getProjects, this), 50);
            return this;
        }
    });
});
