sap.ui.define([
	"sap/m/Input",
	"sap/ui/model/json/JSONModel",
	"com/mii/scanner/model/sapType"
], function(Input, JSONModel, sapType) {
	"use strict";

	/* Create e.g. an SAPUI5 control which you need for your tests
       Alternatively you can do this also in the  method of a module 
     */
	var oData,
		oModel, 
		oInput = new Input("input").placeAt("content");

	
	/* Modules have a second, optional "lifecycle" parameter. The life cycle object can 
       have two methods -  and . Both methods are called for each test
       of the module. It is best practice to use those life cycle methods to have standelone
       tests that do not have dependencies on other tests. 
     */
	QUnit.module("SAP type QUAN", {
		beforeEach: function() {
			
			oData = {
				nullValue: null,
				undefinedValue: undefined,
				emptyValue: "",
				blankValue: " ",
				zeroValue: 0,
				QUAN: 123456789012.891
			};

			oModel = new JSONModel(oData);
			
			oInput.setModel(oModel);
			
			oInput.bindValue("/QUAN", sapType.QUAN);
		},
		afterEach: function() {
			oInput.setValue();
		}
	});

	/* You can also do some actions between the assertions,
	   like triggering a keydown event with Enter key on the
	   Dom element with ID 'input' using the utilities.
	   sap.ui.test.qunit.triggerKeydown("input", "ENTER");
	 */
	QUnit.test("Test User Input", 5, function(assert) {

		oInput.setValue("1");
		assert.strictEqual(oInput.getValue(), "1,000", "minFractionDigits::QUAN value displayed correctly");

		oInput.setValue("0,1234");
		assert.strictEqual(oInput.getValue(), "0,123", "maxFractionDigits::QUAN value displayed correctly");

		oInput.setValue(",1");
		assert.strictEqual(oInput.getValue(), "0,100", "minIntegerDigits::QUAN value displayed correctly");

		oInput.setValue("1234567890123");
		assert.strictEqual(oInput.getValue(), "???.???.???.???,000", "maxIntegerDigits::QUAN value displayed correctly");

		oInput.setValue(oData.emptyValue);
		assert.strictEqual(oInput.getValue(), "", "emptyInput::QUAN value displayed correctly");

	});

	QUnit.test("Test Model Data", 8, function(assert) {

		oModel.setProperty("/QUAN", 1.12);
		assert.strictEqual(oInput.getValue(), "1,120", "minFractionDigits::QUAN value displayed correctly");

		oModel.setProperty("/QUAN", 0.1234);
		assert.strictEqual(oInput.getValue(), "0,123", "maxFractionDigits::QUAN value displayed correctly");

		oModel.setProperty("/QUAN", .1);
		assert.strictEqual(oInput.getValue(), "0,100", "minIntegerDigits::QUAN value displayed correctly");

		oModel.setProperty("/QUAN", 1234567890123);
		assert.strictEqual(oInput.getValue(), "???.???.???.???,000", "maxIntegerDigits::QUAN value displayed correctly");
		
		oModel.setProperty("/QUAN", oData.zeroValue);
		assert.strictEqual(oInput.getValue(), "0,000", "zeroValue::QUAN value displayed correctly");

		oModel.setProperty("/QUAN", oData.emptyValue);
		assert.strictEqual(oInput.getValue(), "0,000", "emptyValue::QUAN value displayed correctly");
		
		oModel.setProperty("/QUAN", oData.nullValue);
		assert.strictEqual(oInput.getValue(), "", "nullValue::QUAN value displayed correctly");

		oModel.setProperty("/QUAN", oData.undefinedValue);
		assert.strictEqual(oInput.getValue(), "", "undefinedValue::QUAN value displayed correctly");
	
	});
	
	QUnit.test("Test User <> Model Interaction", 2, function(assert) {
		
		oInput.setValue("enter-something-invalid");
		assert.strictEqual(oModel.getProperty("/QUAN"), 123456789012.891, "enter-something-invalid::QUAN value is parsed correctly (keeps old value)");
		
		oModel.setProperty("/QUAN", 1234567890123.891);
		assert.strictEqual(oInput.getValue(), "???.???.???.???,891", "model-has-wrong-data::QUAN value is parsed correctly");
	});
});