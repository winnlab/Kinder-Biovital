define([
	'lib/list/list',
	'funcunit'
], 
	function (List, F) {

		var list = new List('#sandbox');

		describe('List', function() {

			it('should have property init', function() {
				list.should.have.property('init');
				F('#sandbox p').length.should.eql(1);
			});

			it('should change "p" color', function() {
				F('#sandbox p').click();
			});

		});

	}
);