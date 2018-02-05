sap.ui.require(
	[
		"com/mii/scanner/Component"
	],
	function(Component) {
		"use strict";
		QUnit.module("Login unit");

		function keyboardInputPreventionTestCase(oOptions) {
			// Act
			var sState = "test";

			// Assert
			oOptions.assert.strictEqual(sState, oOptions.expected, "The price state was correct");
		}
	}
);