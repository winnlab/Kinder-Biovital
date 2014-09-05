define(
    ['canjs', 'lib/edit/edit'],

    function (can, Edit) {

        return Edit.extend({
            defaults: {
                viewpath: 'modules/covers/views/',
                viewName: 'setColor.stache',

                moduleName: 'color',

                successMsg: 'Цвет успешно сохранен.',
                errorMsg: 'Ошибка сохранения цвета.',

                form: '.setColor',
                
                setRoute: false
            }
        }, {});

    }
);
