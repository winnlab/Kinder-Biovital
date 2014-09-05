define(
    ['canjs', 'lib/list/list', 'modules/heroes/hero', 'modules/heroes/heroesModel'],

    function (can, List, Hero, HeroesModel) {

        return List.extend({
            defaults: {
                viewpath: 'app/modules/heroes/views/',

                // Edit entity controller
                Edit: Hero,

                moduleName: 'heroes',
                Model: HeroesModel,

                deleteMsg: 'Вы действительно хотите удалить этого героя?',
                deletedMsg: 'Герой успешно удален!',

                // Selectors
                add: '.addHero',
                edit: '.editHero',
                remove: '.removeHero',
                // 
                formWrap: '.heroForm',
                // Entity selector wich rich with #data view helper
                parentData: '.hero'
            }
        }, {});

    }
);
