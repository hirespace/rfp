(function () {
	"use strict";

	_.session().set("test", {
		testKey: "testValue"
	});

	alert("magic");


})();