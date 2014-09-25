define(
    ['canjs', 'lib/edit/edit'],

    function (can, Edit) {

        return Edit.extend({
            defaults: {
                viewpath: 'modules/covers/views/',
                viewName: 'setImg.stache',

                moduleName: 'image',

                successMsg: 'Цвет успешно сохранен.',
                errorMsg: 'Ошибка сохранения цвета.',

                form: '.setImage',

                setRoute: false
            }
        }, {});

    }
);
