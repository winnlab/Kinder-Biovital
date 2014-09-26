define([
    'canjs'
],

    function (can) {
        var ViewModel = can.Map.extend({
            'cIndex': 0,
            'lastIndex': function () {
                return this.attr('data').length - 1;
            }
        });

        can.Component.extend({
            tag: "list-slider",
            scope: ViewModel,
            template:
                '{{#isnt cIndex 0}}' +
                    '<div class="arrow prev"></div>' +
                '{{/isnt}}' +
                '{{#isnt cIndex lastIndex}}' +
                    '<div class="arrow next"></div>' +
                '{{/isnt}}' +
                '{{#gt data.length 1}}' +
                    '<div class="dotsWrap">' +
                    '{{#each data}}' +
                        '<div data-index="{{@index}}" class="dot{{#is cIndex @index}} active{{/is}}"></div>' +
                    '{{/each}}' +
                    '</div>' +
                '{{/gt}}' +
                '{{#each data}}' +
                    '{{#is cIndex @index}}' +
                        '<content />' +
                    '{{/is}}' +
                '{{/each}}'
            ,
            events: {
                '.prev click': function () {
                    this.scope.attr('cIndex', this.scope.attr('cIndex') - 1);
                },
                '.next click': function () {
                    this.scope.attr('cIndex', this.scope.attr('cIndex') + 1);
                },
                '.dot click': function (el) {
                    this.scope.attr('cIndex', el.data('index'));
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
