(function () {
	"use strict";

	function formFactory() {
		return {
			validate: validate
		};
	}

	_.mixin({
		form: formFactory
	});

	var validate = {
		empty: function (val) {
			return val !== '' && val !== false && val !== null;
		},
		email: function (val) {
			return (/^("([ !\x23-\x5B\x5D-\x7E]*|\\[ -~])+"|[-a-z0-9!#$%&'*+\/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+\/=?^_`{|}~]+)*)@([0-9a-z\u00C0-\u02FF\u0370-\u1EFF]([-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,61}[0-9a-z\u00C0-\u02FF\u0370-\u1EFF])?\.)+[a-z\u00C0-\u02FF\u0370-\u1EFF][-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,17}[a-z\u00C0-\u02FF\u0370-\u1EFF]$/i).test(val);
		},
		numeric: function (val) {
			return (/^-?[0-9]+$/).test(val);
		},
		password: function (val) {
			return (/^.*(?=.{6,})(?=.*\d)(?=.*[a-žA-Ž]).*$/).test(val);
		}
	};
})();