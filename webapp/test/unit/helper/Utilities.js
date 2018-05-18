sap.ui.define([
	"com/mii/scanner/controller/helper/Utilities"
], function(Util) {
	"use strict";

	QUnit.module("Utilities", {
		beforeEach: function() {},
		afterEach: function() {}
	});

	QUnit.test("Should Test padLeadingZero", 3, function(assert) {
		var sFoo = "foo",
			iBar = 123;

		assert.strictEqual(Util.padLeadingZero(sFoo, 3), "foo", "Does not pad anything to 'foo', because ist already length = 3");
		assert.strictEqual(Util.padLeadingZero(sFoo, 4), "0foo", "Pads 1 leading '0' to string 'foo'");
		assert.strictEqual(Util.padLeadingZero(iBar, 5), "00123", "Pads 2 leading '0' to number '123'");
	});

	QUnit.test("Should Test deleteLeadingZeros", 3, function(assert) {
		var sFoo = "000foo",
			iBar = 123,
			fFloat = 1.134;

		assert.strictEqual(Util.deleteLeadingZeros(sFoo), "foo", "Removes 000 from 000foo");
		assert.strictEqual(Util.deleteLeadingZeros(iBar), "123", "Returns unchanged integer value as string");
		assert.strictEqual(Util.deleteLeadingZeros(fFloat), "1.134", "Returns unchanged float value as string");
	});

	QUnit.test("Should Test undef", 2, function(assert) {
		var sFoobar;

		assert.strictEqual(typeof sFoobar, Util.undef, "An undefined var is typeof Util.undef");
		assert.strictEqual(typeof sFoobar === Util.undef, true, "typeof undefined var is equal to Util.undef");
	});
});