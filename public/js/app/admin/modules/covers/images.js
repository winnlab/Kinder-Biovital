define(
    ['canjs', 'lib/list/list', 'modules/covers/image', 'modules/covers/imagesModel'],

    function (can, List, Image, ImageModel) {

        return List.extend({
            defaults: {
                viewName: 'imgList.stache',

                Edit: Image,

                moduleName: 'images',
                Model: ImageModel,

                deleteMsg: 'Вы действительно хотите удалить эту картику обложки?',
                deletedMsg: 'Картинка обложки успешно удалена!',

                add: '.addImg',
                edit: '.editImg',
                remove: '.removeImg',

                formWrap: '.imgForm',

                parentData: '.img'
            }
        }, {
            '{add} click': function () {
                this.setDocCallback(0);
            },

            '{edit} click': function (el) {
                var id = el.parents(this.options.parentData)
                    .data(this.options.moduleName).attr('_id');
                this.setDocCallback(id);
            },

            '{toList} click': function () {
                this.toListCallback();
            }
        });

    }
);
