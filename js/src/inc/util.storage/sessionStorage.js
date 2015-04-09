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

	function setObject(key, value) {
		var setValue = _.isObject(value) || _.isArray(value) ? JSON.stringify(value) : value;

		window.sessionStorage.setItem(key, setValue);
		return true;
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