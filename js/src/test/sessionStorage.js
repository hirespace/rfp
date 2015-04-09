"use strict";

describe("_.session()", function () {
	it("should be defined and have set, get, and remove methods", function () {
		var a = _.session();
		var methods = ["set", "get", "remove"];

		expect(a).toBeDefined();

		_.map(methods, function(method) {
			expect(_.session()[method]).toBeDefined();
		});
	});
});