define(
    ['canjs', 'lib/edit/edit'],

    function (can, Edit) {

        return Edit.extend({
            defaults: {
                viewpath: 'modules/tracks/views/',

                moduleName: 'track',

                successMsg: 'Трек успешно сохранен.',
                errorMsg: 'Ошибка сохранения трека.',

                form: '.setTrack'
            }
        }, {});

    }
);
