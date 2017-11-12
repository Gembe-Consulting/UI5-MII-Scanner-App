sap.ui.require(
	[
		"com/mii/scanner/controller/Login.controller",
		"sap/m/Input"
	],
	function (LoginController, Input) {
		"use strict";

		QUnit.module("Prevent Login with keyboard entry", {

			beforeEach : function () {
				this.oLoginController = new LoginController();
				this.oInput = new Input({
					value: "foo"
				}).placeAt("myContent");
			},

			afterEach : function () {
				this.oLoginController.destroy();
				this.oInput.destroy();
			}
		});

		function keyboardInputPreventionTestCase(oOptions) {
			// Act
			var sState = this.oLoginController.purgeInputAfterDelay(this.oInput);
			
			// Assert
			oOptions.assert.strictEqual(sState, oOptions.expected, "The price state was correct");
		}
		QUnit.test("Should keep the value after less than 75 ms to success", function (assert) {
			keyboardInputPreventionTestCase.call(this, {
				assert: assert,
				price: 70,
				expected: "foo"
			});
		});
	}
);