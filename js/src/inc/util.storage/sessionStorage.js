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
		session: sessionStorageFactory
	});

	function setObject(key, data) {
		if (_.isObject(data) || _.isArray(data)) {
			window.sessionStorage.setItem(key, JSON.stringify(data));
			return true;
		} else {
			debug.error("Only an Object or an Array is allowed");
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