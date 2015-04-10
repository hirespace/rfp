"use strict";

describe("_.sessionStorage()", function () {
	it("should be defined and have set, get, and remove methods", function () {
		var a = _.sessionStorage();
		var methods = ["set", "get", "remove"];

		expect(a).toBeDefined();

		_.map(methods, function (method) {
			expect(_.sessionStorage()[method]).toBeDefined();
		});
	});
});

describe("_.sessionStorage().set()", function () {
	it("should set objects and arrays into sessionStorage", function () {
		var dataIn = [
				{testObjectKey: "testObjectValue"},
				["testArrayValue1", "testArrayValue2"]
			];

		_.forEach(dataIn, function (datum) {
			var dataSet = _.sessionStorage().set("test", datum),
				dataOut = window.sessionStorage.getItem("test");

			expect(dataSet).toBe(true);
			expect(JSON.parse(dataOut)).toEqual(datum);
		});

		// Yeah, clearing up the mess!!
		window.sessionStorage.removeItem("test");
	});
});

describe("_.sessionStorage().set()", function () {
	it("should not set non-objects and non-arrays into sessionStorage", function () {
		var dataIn = [
			true,
			null,
			42,
			"testString"
		];

		_.forEach(dataIn, function (datum) {
			var dataSet = _.sessionStorage().set("test", datum);

			expect(dataSet).toBe(false);
		});

		// Yeah, clearing up the mess!!
		window.sessionStorage.removeItem("test");
	});
});