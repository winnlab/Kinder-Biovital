define(
    [
        'canjs',
        'lib/edit/edit',
        'admin-lte/js/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min',
        'css!admin-lte/css/bootstrap-wysihtml5/bootstrap3-wysihtml5.min'
    ],

    function (can, Edit) {

        return Edit.extend({
            defaults: {
                viewpath: 'modules/pages/views/',

                moduleName: 'page',

                successMsg: 'Страница успешно сохранена.',
                errorMsg: 'Ошибка сохранения страницы.',

                form: '.setPage'
            }
        }, {

            '.addInnerPage click': function () {
                var page = this.options.doc;
                if (!page.attr('frames')) {
                    page.attr('frames', []);
                }
                page.attr('frames').push({frame: []});
            },

            getDocData: function (el) {
                var data = can.deparam(el.serialize());

                data.frames = [];

                $('.pageFrame').each(function () {
                    innerData = can.deparam($(this).serialize()).frame;
                    data.frames.push({
                        frame: innerData
                    });
                    // data.frames.push(innerData);
                });

                return data;
            }

        });

    }
);
