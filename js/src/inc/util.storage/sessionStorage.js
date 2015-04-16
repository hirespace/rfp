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
	// an Object/Array, or something else. Therefore we are only allowing Objects and Arrays.
	function setObject(key, value) {
		if (_.isObject(value) || _.isArray(value)) {
			window.sessionStorage.setItem(key, JSON.stringify(value));
			return true;
		}

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