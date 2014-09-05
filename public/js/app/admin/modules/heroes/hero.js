define(
    ['canjs', 'lib/edit/edit'],

    function (can, Edit) {

        return Edit.extend({
            defaults: {
                viewpath: 'modules/heroes/views/',

                moduleName: 'hero',

                successMsg: 'Герой успешно сохранен.',
                errorMsg: 'Ошибка сохранения героя.',

                form: '.setHero'
            }
        }, {});

    }
);
