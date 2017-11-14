sap.ui.define([
		"com/mii/scanner/controller/Login.controller",
		"sap/m/Input"
	], function(LoginController, Input) {
		"use strict";
		
			
		QUnit.module("Prevent Login with keyboard entry", {

			beforeEach: function() {
				this.oLoginController = new LoginController();
				this.oInput = new Input("userIdInput").placeAt("content");
				sap.ui.getCore().applyChanges();
			},

			afterEach: function() {
				this.oLoginController.destroy();
				this.oInput.destroy();
			}
		});
		
		function keyboardInputPreventionTestCase(oOptions) {
			// Act
			var done = oOptions.assert.async(); 
			this.oInput.setValue("foo");
			this.oLoginController.purgeInputAfterDelay(this.oInput);
			
			// Assert
			oOptions.assert.ok(this.oInput !== undefined, "Ok, Input field is present");
			
			setTimeout(function() {
				assert.strictEqual(this.oInput.getValue(), oOptions.expected, "Value as expected after after " + oOptions.delay + "ms");
				done();
			}.bind(this), oOptions.delay);
			
		}

		QUnit.test("Should keep the value after less than 75 ms to success", 2, function (assert) {
			keyboardInputPreventionTestCase.call(this, {
				assert: assert,
				delay: 74,
				expected: "foo"
			});
		});
		
		QUnit.test("Should purge the value after more than 75 ms to success", 2, function (assert) {
			keyboardInputPreventionTestCase.call(this, {
				assert: assert,
				delay: 76,
				expected: ""
			});
		});
		
		QUnit.test("Should purge the value after 100 ms to success", 2, function (assert) {
			keyboardInputPreventionTestCase.call(this, {
				assert: assert,
				delay: 100,
				expected: ""
			});
		});
		
		
		QUnit.test("Should purge keyboard value after more than 75 ms to success", 3, function (assert) {
			// System under test
			var delay = 100,
				done = assert.async(),
				sInitValue = "Foo",
				sNewValue = "Bar",
				oInput2 = new Input({
					value : sInitValue
				});
				
			// Arrange
			oInput2.placeAt("content");
			sap.ui.getCore().applyChanges();
				
			// Act - set dom value
			oInput2.getFocusDomRef().value = sNewValue;

			// Assert - before enter
			assert.strictEqual(oInput2.getFocusDomRef().value, oInput2.getValue(), "Before event call dom value and value property are not same.");
			
			// Act - press enter
			sap.ui.test.qunit.triggerKeyboardEvent(oInput2.getFocusDomRef(), "ENTER");
				
			
			// Assert - after enter
			assert.strictEqual(oInput2.getValue(), sNewValue, "Input is the same directly after enter");
			
			
			setTimeout(function() {
				assert.strictEqual(oInput2.getValue(), sNewValue, "Value cleared after " + delay + "ms");
				done();
			}.bind(this), delay);
			
		});
	}
);