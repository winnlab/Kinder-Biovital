define([
	'canjs',
    'underscore'
],
	function (can, _) {

		function getObserverValue (value) {
			if (typeof value === 'function') {
				value = value();
			}
			return value;
		};

		can.mustache.registerHelper('checkState', function (options) {
			return options.context.attr('viewState') === 'list'
				? options.fn()
				: options.inverse();
		});

		can.mustache.registerHelper('is', function (left, right, options) {
			return getObserverValue(left) === getObserverValue(right)
				? options.fn()
				: options.inverse();
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
