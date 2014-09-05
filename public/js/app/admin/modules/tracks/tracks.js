define(
    ['canjs', 'lib/list/list', 'modules/tracks/track', 'modules/tracks/tracksModel'],

    function (can, List, Track, TracksModel) {

        return List.extend({
            defaults: {
                viewpath: 'app/modules/tracks/views/',

                Edit: Track,

                moduleName: 'tracks',
                Model: TracksModel,

                deleteMsg: 'Вы действительно хотите удалить этот трек?',
                deletedMsg: 'Трек успешно удалена!',


                add: '.addTrack',
                edit: '.editTrack',
                remove: '.removeTrack',

                formWrap: '.trackForm',

                parentData: '.track'
            }
        }, {});

    }
);
