define([
    'canjs'
],

    function (can) {
        var ViewModel = can.Map.extend({
            'view': '@',
            'cIndex': 0,
            'count': '@',
            'lastIndex': function () {
                var count = this.attr('count') || 3
                return this.attr('data').length - count;
            }
        });

        can.Component.extend({
            tag: "item-scroll",
            scope: ViewModel,
            template:
                '{{#isnt cIndex 0}}' +
                    '<div class="arrow top"></div>' +
                '{{/isnt}}' +
                '{{#gt data.length count}}'+
                    '{{#isnt cIndex lastIndex}}' +
                        '<div class="arrow btm"></div>' +
                    '{{/isnt}}' +
                '{{/gt}}'+
                '{{#each data}}' +
                    '{{#in cIndex @index count}}' +
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
                },
                '{data} change': function (data, ev, attr, how) {
                    if (attr.indexOf('.') === -1 && (how === 'add' || how === 'remove')) {
                        var cIndex = this.scope.attr('cIndex');
                        if (how === 'add') {                            
                            this.scope.attr('cIndex', data.attr('length') - this.scope.attr('count'));
                        }
                        if (how === 'remove') {
                            this.scope.attr('cIndex', cIndex - 1);
                        }
                    }
                }
            },
            helpers: {
                in: function (cIndex, index, count, options) {
                    cIndex = cIndex();
                    index = index();
                    count = count() - 1;
                    return index >= cIndex && cIndex + count >= index
                        ? options.fn()
                        : options.inverse();
                }
            }
        });
    }
);
