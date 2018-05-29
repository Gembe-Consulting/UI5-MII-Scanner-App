sap.ui.define([
	"com/mii/scanner/controller/helper/Utilities"
], function(Util) {
	"use strict";
	/* eslint-disable */

	QUnit.module("Utilities", {
		beforeEach: function() {},
		afterEach: function() {}
	});

	QUnit.test("Should Test Utility constants", 6, function(assert) {

		assert.strictEqual(Util.blank, " ", "Util.blank is ' '");
		assert.strictEqual(Util.blank.length, 1, "Util.blank length is 1");
		assert.strictEqual(Util.empty, "", "Util.empty is ''");
		assert.strictEqual(Util.empty.length, 0, "Util.empty length is 0");
		assert.strictEqual(Util.undef, "undefined", "Util.undef is equal to 'undefined'");
		assert.strictEqual(Util.undef, typeof undefined, "Util.undef is equal to typeof undefined");
	});	
	
	QUnit.test("Should Test containsNonNumericChars", 4, function(assert) {

		assert.strictEqual(Util.containsNonNumericChars("0123456789"), false, "'0123456789' does not contain non-numeric chars");
		assert.strictEqual(Util.containsNonNumericChars("100010-123"), true, "'100010-123' contains non-numeric chars");
		assert.strictEqual(Util.containsNonNumericChars("1.2"), true, "'1.2' contains non-numeric chars");
		assert.strictEqual(Util.containsNonNumericChars("ABC"), true, "'ABC' contains non-numeric chars");
	});	

	QUnit.test("Should Test padLeadingZeros", 3, function(assert) {
		var sFoo = "foo",
			iBar = 123;

		assert.strictEqual(Util.padLeadingZeros(sFoo, 3), "foo", "Does not pad anything to 'foo', because ist already length = 3");
		assert.strictEqual(Util.padLeadingZeros(sFoo, 4), "0foo", "Pads 1 leading '0' to string 'foo'");
		assert.strictEqual(Util.padLeadingZeros(iBar, 5), "00123", "Pads 2 leading '0' to number '123'");
	});

	QUnit.test("Should Test trimLeadingZeros", 3, function(assert) {
		var sFoo = "000foo",
			iBar = 123,
			fFloat = 1.134;

		assert.strictEqual(Util.trimLeadingZeros(sFoo), "foo", "Removes 000 from 000foo");
		assert.strictEqual(Util.trimLeadingZeros(iBar), "123", "Returns unchanged integer value as string");
		assert.strictEqual(Util.trimLeadingZeros(fFloat), "1.134", "Returns unchanged float value as string");
	});

	QUnit.test("Should Test undef", 2, function(assert) {
		var sFoobar;

		assert.strictEqual(typeof sFoobar, Util.undef, "An undefined var is typeof Util.undef");
		assert.strictEqual(typeof sFoobar === Util.undef, true, "typeof undefined var is equal to Util.undef");
	});
});