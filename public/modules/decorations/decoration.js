define(
    ['canjs', 'lib/edit/edit'],

    function (can, Edit) {

        return Edit.extend({
            defaults: {
                viewpath: 'modules/decorations/views/',

                moduleName: 'decoration',

                successMsg: 'Декорация успешно сохранена.',
                errorMsg: 'Ошибка сохранения декорации.',

                form: '.setDecoration'
            }
        }, {});

    }
);
