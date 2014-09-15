define(
    ['canjs', 'lib/edit/edit'],

    function (can, Edit) {

        return Edit.extend({
            defaults: {
                viewpath: 'modules/pages/views/',

                moduleName: 'page',

                successMsg: 'Страница успешно сохранена.',
                errorMsg: 'Ошибка сохранения страницы.',

                form: '.setPage',

                setRoute: false
            }
        }, {});

    }
);
