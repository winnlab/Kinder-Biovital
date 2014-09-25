define(
    ['canjs', 'lib/list/list', 'modules/covers/color', 'modules/covers/colorModel'],

    function (can, List, Color, ColorModel) {

        return List.extend({
            defaults: {
                viewName: 'colorList.stache',

                Edit: Color,

                moduleName: 'color',
                Model: ColorModel,

                deleteMsg: 'Вы действительно хотите удалить этот цвет?',
                deletedMsg: 'Цвет успешно удален!',

                add: '.addColor',
                edit: '.editColor',
                remove: '.removeColor',

                formWrap: '.colorForm',

                parentData: '.color'
            }
        }, {
            '{add} click': function () {
                this.setDocCallback(0);
            },

            '{edit} click': function (el) {                
                var id = el.parents(this.options.parentData)
                    .data(this.options.moduleName).attr('_id');
                this.setDocCallback(id);
            },

            '{toList} click': function () {
                this.toListCallback();
            }
        });
    }
);
