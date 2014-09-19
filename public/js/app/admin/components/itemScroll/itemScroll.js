define([
    'canjs'
],

    function (can) {
        var ViewModel = can.Map.extend({
            'view': '@',
            'cIndex': 0,
            'count': '@',

            lastIndex: function () {
                var count = this.attr('count') || 3;
                return this.attr('data.length') - count;
            },

            nextItem: function (idx) {
                var index = this.attr('cIndex') + 1;

                if (idx) {
                    index = idx;
                }

                if (index <= this.lastIndex() && index >= 0) {
                    this.attr('cIndex', index);
                }

            },

            prevItem: function () {
                var index = this.attr('cIndex') - 1;
                if (index >= 0) {
                    this.attr('cIndex', index);
                }
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
                    '<div class="item" style="display: {{in cIndex @index count}};">' +
                        '<content />' +
                    '</div>' +
                '{{/each}}'
            ,
            events: {
                '.top click': function () {
                    this.scope.prevItem();
                },
                '.btm click': function () {
                    this.scope.nextItem();
                },
                '{data} change': function (data, ev, attr, how) {
                    if (attr.indexOf('.') === -1 && (how === 'add' || how === 'remove')) {

                        if (how === 'add') {
                            this.scope.nextItem(data.attr('length') - this.scope.attr('count'));
                        }
                        if (how === 'remove') {
                            this.scope.prevItem();
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
                        // ? options.fn()
                        // : options.inverse();
                        ? 'block'
                        : 'none';
                }
            }
        });
    }
);
