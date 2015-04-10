(function () {
	"use strict";

	function sessionStorageFactory() {
		return {
			set: setObject,
			get: getObject,
			remove: removeObject
		};
	}

	_.mixin({
		sessionStorage: sessionStorageFactory
	});

	// Since the getObject method always parses a string, there is no way to differentiate whether we passed
	// an object/array, or a simple string.
	function setObject(key, value) {
		if (_.isObject(value) || _.isArray(value)) {
			window.sessionStorage.setItem(key, JSON.stringify(value));
			return true;
		}

		debug.error("You can only pass Objects and Arrays");
		return false;
	}

	function getObject(key) {
		var data = window.sessionStorage.getItem(key);
		return data ? JSON.parse(data) : false;
	}

	function removeObject(key) {
		if (getObject(key)) {
			window.sessionStorage.removeItem(key);
			return true;
		}

		return false;
	}

})();