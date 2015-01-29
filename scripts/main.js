;(function() {
	'use strict';

	$(init);

	var YOUR_NAME = 'Asa';

	function init() {
		var html = templates['test-view']({name: YOUR_NAME});

		$('#content').html(html);
	}
})();
