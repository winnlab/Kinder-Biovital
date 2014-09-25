define(
    ['canjs', 'lib/list/list', 'modules/pages/page', 'modules/pages/pagesModel'],

    function (can, List, Page, PagesModel) {

        return List.extend({
            defaults: {
                viewpath: 'app/modules/pages/views/',

                Edit: Page,

                moduleName: 'pages',
                Model: PagesModel,

                deleteMsg: 'Вы действительно хотите удалить эту страницу?',
                deletedMsg: 'Страница успешно удалена!',

                add: '.addPage',
                edit: '.editPage',
                remove: '.removePage',

                formWrap: '.pageForm',

                parentData: '.page'
            }
        }, {});

    }
);
