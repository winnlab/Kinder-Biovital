define([
	'canjs',
    'underscore'
],
	function (can, _) {

		'use strict';

		function getObserverValue (value) {
			if (typeof value === 'function') {
				value = value();
			}
			return value;
		};

		can.mustache.registerHelper('is', function () {
			var options = arguments[arguments.length - 1],
				comparator = getObserverValue(arguments[0]),
				result = true;

			for (var i = 1, ln = arguments.length - 1; i < ln; i += 1) {
				if (comparator !== getObserverValue(arguments[i])) {
					result = false;
					break;
				}
			}

			return result ? options.fn() : options.inverse();
		});


		can.mustache.registerHelper('isnt', function (a, b, options) {
			var result = getObserverValue(a) !== getObserverValue(b);
			return result ? options.fn() : options.inverse();
		});

		can.mustache.registerHelper('or', function () {
			var options = arguments[arguments.length - 1],
				result = false;

			for (var i = arguments.length - 1; i--; ) {
				if (getObserverValue(arguments[i])) {
					result = true;
					break;
				}
			}

			return result ? options.fn() : options.inverse();
		});

		can.mustache.registerHelper('plus', function (a, b) {
			return getObserverValue(a) + getObserverValue(b);
		});

		can.mustache.registerHelper('indexOfInc', function (array, element) {
			return getObserverValue(array).indexOf(getObserverValue(element)) + 1;
		});

		can.mustache.registerHelper('getArrayObjValue', function (array, index, key) {
			return array() ? array().attr(index + '.' + key) : '';
		});

		can.mustache.registerHelper('sortedBy', function (collection, prop, options) {
			collection = collection();
			if (collection && collection.attr('length') && prop) {
				var sorted = _.sortBy(collection, function (member) {
					return member.attr(prop);
				});

				return _.map(sorted, function (member, index) {
					return options.fn(options.scope
						.add({'@index': index})
						.add(member)
					);
				}).join('');
			}
		});

		can.mustache.registerHelper('getBoxName', function (index, options) {
			var classes = ['bg-light-blue', 'bg-red', 'bg-green', 'bg-yellow', 'bg-maroon', 'bg-purple', 'bg-aqua'];
			index = getObserverValue(index);
			if (!index && index !== 0) {
				index = ~~(Math.random() * classes.length - 1);
			}
			return classes[index % classes.length];
		});

		can.mustache.registerHelper('make3Col', function (index) {
			return (index() + 1) % 3 === 0 ? '<div class="clearfix"></div>' : '';
		});

	}
);
