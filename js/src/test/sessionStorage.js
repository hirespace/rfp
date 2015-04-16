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
	it("should set Objects and Arrays into sessionStorage", function () {
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
	it("should not set non-Objects and non-Arrays into sessionStorage", function () {
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

// This test could consist of less lines, but in terms of readability, I feel like the below is fine
describe("_.sessionStorage().get()", function () {
	it("should get an Object or an Array from sessionStorage provided a key", function () {
		var dataIn = {testObjectKey: "testObjectValue"};

		_.sessionStorage().set("test", dataIn);

		var dataOut = _.sessionStorage().get("test");

		expect(dataOut).toEqual(dataIn);

		// Yeah, clearing up the mess!!
		window.sessionStorage.removeItem("test");
	});
});

describe("_.sessionStorage().get()", function () {
	it("should not get an Object or an Array from sessionStorage provided a non-existant key", function () {
		var dataIn = {testObjectKey: "testObjectValue"};

		_.sessionStorage().set("test", dataIn);

		var dataOut = _.sessionStorage().get("testFail");

		expect(dataOut).toBe(false);

		// Yeah, clearing up the mess!!
		window.sessionStorage.removeItem("test");
	});
});

describe("_.sessionStorage().remove()", function () {
	it("should remove an Object or an Array from sessionStorage provided a key", function () {
		var dataIn = {testObjectKey: "testObjectValue"};

		_.sessionStorage().set("test", dataIn);
		_.sessionStorage().remove("test");

		var dataOut = _.sessionStorage().get("test");

		expect(dataOut).toBe(false);

		// Yeah, clearing up the mess!!
		window.sessionStorage.removeItem("test");
	});
});