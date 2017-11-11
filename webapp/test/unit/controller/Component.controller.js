sap.ui.require(
	[
		"com/mii/scanner/Component"
	],
	function (Component) {
		"use strict";
		QUnit.module("Login unit");

		function keyboardInputPreventionTestCase(oOptions) {
			// Act
			var sState = Component.priceState(oOptions.price);
			
			// Assert
			oOptions.assert.strictEqual(sState, oOptions.expected, "The price state was correct");
		}
		QUnit.test("Should format the products with a price lower than 50 to Success", function (assert) {
			priceStateTestCase.call(this, {
				assert: assert,
				price: 42,
				expected: "Success"
			});
		});
	}
);