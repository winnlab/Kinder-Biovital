define(
    ['canjs', 'lib/list/list', 'modules/replica/replica', 'modules/replica/replicaModel'],

    function (can, List, Replica, ReplicaModel) {

        return List.extend({
            defaults: {
                viewpath: 'app/modules/replica/views/',

                Edit: Replica,

                moduleName: 'replica',
                Model: ReplicaModel,

                deleteMsg: 'Вы действительно хотите удалить эту реплику?',
                deletedMsg: 'Реплика успешно удалена!',

                
                add: '.addReplica',
                edit: '.editReplica',
                remove: '.removeReplica',

                formWrap: '.replicaForm',

                parentData: '.replica'
            }
        }, {});

    }
);
