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
	it("should set new data into sessionStorage", function () {
		var dataIn = {testKey: "testValue"},
			dataSet = _.sessionStorage().set("test", dataIn),
			dataOut = window.sessionStorage.getItem("test");

		expect(dataSet).toBe(true);
		expect(JSON.parse(dataOut)).toEqual(dataIn);
	});
});