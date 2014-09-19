define(
    ['canjs', 'core/appState'],

    function (can, appState) {

        var PopUp = can.Control.extend({
            defaults: {
                viewpath: '/js/app/admin/lib/popUp/views/'
            }
        }, {

            init: function () {
                this.module = new can.Map({
                    msg: '',
                    modal: true,
                    visible: false,
                    choice: true,
                    close: true
                });

                this.element.append(can.view(this.options.viewpath + 'index.stache', {
                    popUp: this.module,
                    appState: appState
                }));
            },

            show: function (options) {
                this.def = options.def;

                this.module.attr({
                    'msg': options.msg,
                    'choice': typeof options.choice == 'undefined' ? true : options.choice,
                    'visible': true,
                    'msgLength': options.msg.length > 200 ? true : false
                });                
            },

            '.ok click': function() {
                this.closePopup(0);
            },

            '.yes click': function () {
                this.closePopup(1);
            },

            '.no click': function () {
                this.closePopup(-1);
            },

            '.close click': function () {
                this.closePopup(-1);
            },

            closePopup: function (type) {

                if (this.def && type === 1) {
                    this.def.resolve();
                }

                if (this.def && type === -1) {
                    this.def.reject();
                }

                this.module.attr('visible', false);

                this.def = null
            }

        });

        return new PopUp('body');

    }
)
