define(
    ['canjs', 'lib/edit/edit'],

    function (can, Edit) {

        return Edit.extend({
            defaults: {
                viewpath: 'modules/replica/views/',

                moduleName: 'replica',

                successMsg: 'Реплика успешно сохранена.',
                errorMsg: 'Ошибка сохранения реплики.',

                form: '.setReplica'
            }
        }, {});

    }
);
