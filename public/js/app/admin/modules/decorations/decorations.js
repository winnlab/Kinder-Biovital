define(
    ['canjs', 'lib/list/list', 'modules/decorations/decoration', 'modules/decorations/decorationsModel'],

    function (can, List, Decoration, DecorationsModel) {

        return List.extend({
            defaults: {
                viewpath: 'app/modules/decorations/views/',

                Edit: Decoration,

                moduleName: 'decorations',
                Model: DecorationsModel,

                deleteMsg: 'Вы действительно хотите удалить эту декорацию?',
                deletedMsg: 'Декорация успешно удалена!',

                add: '.addDecoration',
                edit: '.editDecoration',
                remove: '.removeDecoration',

                formWrap: '.decorationForm',

                parentData: '.decoration'
            }
        }, {});

    }
);
