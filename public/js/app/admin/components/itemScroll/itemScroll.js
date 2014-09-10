define([
    'canjs'
],

    function (can) {
        var ViewModel = can.Map.extend({
            'view': '@',
            'cIndex': 0,
            'lastIndex': function () {
                return this.attr('data').length - 3;
            }
        });

        can.Component.extend({
            tag: "item-scroll",
            scope: ViewModel,
            template:
                '{{#isnt cIndex 0}}' +
                    '<div class="arrow top"></div>' +
                '{{/isnt}}' +
                '{{#isnt cIndex lastIndex}}' +
                    '<div class="arrow btm"></div>' +
                '{{/isnt}}' +
                '{{#each data}}' +
                    '{{#in cIndex @index}}' +
                        '<content />' +
                    '{{/in}}' +
                '{{/each}}'
            ,
            events: {
                '.top click': function () {
                    this.scope.attr('cIndex', this.scope.attr('cIndex') - 1);
                },
                '.btm click': function () {
                    this.scope.attr('cIndex', this.scope.attr('cIndex') + 1);
                }
            },
            helpers: {
                in: function (cIndex, index, options) {
                    cIndex = cIndex();
                    index = index();
                    return index >= cIndex && cIndex + 2 >= index
                        ? options.fn()
                        : options.inverse();
                }
            }
        });
    }
);
