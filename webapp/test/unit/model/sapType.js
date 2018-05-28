sap.ui.define([
	"sap/m/Input",
	"sap/ui/model/json/JSONModel",
	"com/mii/scanner/model/sapType"
], function(Input, JSONModel, sapType) {
	"use strict";
	/* eslint-disable */

	/** FAQ **
	 * see https://sapui5.hana.ondemand.com/sdk/#/topic/07e4b920f5734fd78fdaa236f26236d8
	 * 
	 * What is formatting?
	 * Data is stored in the Model in a format for the data source (internal format). Formatting is making the data readable for the user, 
	 * describing how to display data on the UI (external format). 
	 * Model -> UI
	 * 
	 * What is parsing
	 * User enter data in their readable format, thus parsing converts data to the internal format for the data source.
	 * UI -> Model
	 * 
	 * What is validating?
	 * Validating is comparing the user input against constraints - how the data should look like. 
	 * UI -> Model
	 * 
	 */

	var oDefault = {
		nullValue: null,
		undefinedValue: undefined,
		emptyValue: "",
		blankValue: " ",
		zeroValue: 0
	};

	function setModelPropertyTestCase(sTestName, oOptions) {
		QUnit.test(sTestName, 6, function(assert) {
			// System under Test
			var oInput = new Input("input"),
				oModel = new JSONModel({
					currentValue: null
				});

			// Arrange 
			oInput.setModel(oModel);
			oInput.placeAt("content");
			oInput.bindValue("/currentValue", oOptions.type);
			sap.ui.getCore().applyChanges();

			// Assert - before
			assert.strictEqual(jQuery(oInput.getFocusDomRef()).val(), "", "Input value is empty");
			assert.strictEqual(oModel.getProperty("/currentValue"), null, "Model value is null");

			// Act
			oModel.setProperty("/currentValue", oOptions.value);

			// Assert
			assert.strictEqual(oModel.getProperty("/currentValue"), oOptions.expectedModelValue, "Model: Value parsed correctly: '" + oOptions.value + "' -> " + oOptions.expectedModelValue + "");
			assert.strictEqual(jQuery(oInput.getFocusDomRef()).val(), oOptions.expectedOutput, "Display: Value formatted correctly: '" + oOptions.value + "' -> '" + oOptions.expectedOutput + "'");
			assert.strictEqual(typeof oModel.getProperty("/currentValue"), oOptions.expectedModelTypeof, "JS-Type is " + oOptions.expectedModelTypeof);
			assert.strictEqual(oInput.getValueState(), oOptions.expectedValueState, "Value state is " + oOptions.expectedValueState);

			// Cleanup
			oInput.destroy();

		});
	};

	function setValueTestCase(sTestName, oOptions) {
		QUnit.test(sTestName, 4, function(assert) {
			// System under Test
			var oInput = new Input("input"),
				oModel = new JSONModel({
					currentValue: null
				});

			// Arrange 
			oInput.setModel(oModel);
			oInput.placeAt("content");
			oInput.bindValue("/currentValue", oOptions.type);
			sap.ui.getCore().applyChanges();

			// Act
			oInput.setValue(oOptions.value)

			// Assert
			assert.strictEqual(jQuery(oInput.getFocusDomRef()).val(), oOptions.expectedOutput, "Display: Value formatted correctly: '" + oOptions.value + "' -> '" + oOptions.expectedOutput + "'");
			assert.strictEqual(oModel.getProperty("/currentValue"), oOptions.expectedModelValue, "Model: Value parsed correctly: '" + oOptions.value + "' -> " + oOptions.expectedModelValue + "");
			assert.strictEqual(typeof oModel.getProperty("/currentValue"), oOptions.expectedModelTypeof, "JS-Type is " + oOptions.expectedModelTypeof);
			assert.strictEqual(oInput.getValueState(), oOptions.expectedValueState, "Value state is " + oOptions.expectedValueState);

			// Cleanup
			oInput.destroy();
		});
	};

	function invalidateValueTestCase(sTestName, oOptions) {
		QUnit.test(sTestName, 5, function(assert) {
			// System under Test
			var oInput = new Input("input"),
				oModel = new JSONModel(jQuery.extend({}, oDefault));

			// Arrange 
			oInput.setModel(oModel);
			oInput.placeAt("content");
			oInput.bindValue("/currentValue", oOptions.type);
			sap.ui.getCore().applyChanges();

			oInput.setValue(oOptions.value)

			// Assert - precondition
			assert.strictEqual(jQuery(oInput.getFocusDomRef()).val(), oOptions.expectedOutput, "Display: Value formatted correctly: '" + oOptions.value + "' -> '" + oOptions.expectedOutput + "'");
			assert.strictEqual(oModel.getProperty("/currentValue"), oOptions.expectedModelValue, "Model: Value parsed correctly: '" + oOptions.value + "' -> " + oOptions.expectedModelValue + "");

			// Act
			oInput.setValue(oOptions.invalidValue)

			// Assert 
			assert.strictEqual(jQuery(oInput.getFocusDomRef()).val(), oOptions.invalidValue, "Display: Value shows invalid input " + oOptions.invalidValue);
			assert.strictEqual(oModel.getProperty("/currentValue"), oOptions.expectedModelValue, "Model: Value is still previous value " + oOptions.expectedModelValue);
			assert.strictEqual(oInput.getValueState(), oOptions.expectedValueState, "Value state is " + oOptions.expectedValueState);

			// Cleanup
			oInput.destroy();
		});
	};

	/* Modules have a second, optional "lifecycle" parameter. The life cycle object can 
       have two methods -  and . Both methods are called for each test
       of the module. It is best practice to use those life cycle methods to have standelone
       tests that do not have dependencies on other tests. 
     */
	QUnit.module("Parsing SAP type QUAN");

	setValueTestCase("Should handle '1' considering minFractionDigits", {
		type: sapType.QUAN,
		value: "1",
		expectedOutput: "1,000",
		expectedModelValue: 1,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	});

	setValueTestCase("Should handle '0,1234' considering maxFractionDigits", {
		type: sapType.QUAN,
		value: "0,1234",
		expectedOutput: "0,123",
		expectedModelValue: 0.1234,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	});

	setValueTestCase("Should handle ',1' considering minIntegerDigits", {
		type: sapType.QUAN,
		value: ",1",
		expectedOutput: "0,100",
		expectedModelValue: 0.1,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	});

	setValueTestCase("Should handle '1234567890123' considering maxIntegerDigits", {
		type: sapType.QUAN,
		value: "1234567890123",
		expectedOutput: "???.???.???.???,000",
		expectedModelValue: 1234567890123.0,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	});

	setValueTestCase("Should handle '' considering empty value", {
		type: sapType.QUAN,
		value: oDefault.emptyValue,
		expectedOutput: "",
		expectedModelValue: null,
		expectedModelTypeof: "object",
		expectedValueState: "None"
	});

	setValueTestCase("Should handle ' ' considering blank value", {
		type: sapType.QUAN,
		value: oDefault.blankValue,
		expectedOutput: " ",
		expectedModelValue: null,
		expectedModelTypeof: "object",
		expectedValueState: "None"
	});

	setValueTestCase("Should handle 'invalid-value'", {
		type: sapType.QUAN,
		value: "invalid-value",
		expectedOutput: "invalid-value",
		expectedModelValue: null,
		expectedModelTypeof: "object",
		expectedValueState: "None"
	});

	QUnit.module("Formatting SAP type QUAN");

	setModelPropertyTestCase("Should handle 1.12 considering minFractionDigits", {
		type: sapType.QUAN,
		value: 1.12,
		expectedOutput: "1,120",
		expectedModelValue: 1.12,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	});
	setModelPropertyTestCase("Should handle 0.1234 considering maxFractionDigits", {
		type: sapType.QUAN,
		value: 0.1234,
		expectedOutput: "0,123",
		expectedModelValue: 0.1234,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	})
	setModelPropertyTestCase("Should handle .1 considering minIntegerDigits", {
		type: sapType.QUAN,
		value: .1,
		expectedOutput: "0,100",
		expectedModelValue: 0.1,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	})
	setModelPropertyTestCase("Should handle 1234567890123 considering maxIntegerDigits", {
		type: sapType.QUAN,
		value: 1234567890123,
		expectedOutput: "???.???.???.???,000",
		expectedModelValue: 1234567890123,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	})
	setModelPropertyTestCase("Should handle zero value", {
		type: sapType.QUAN,
		value: oDefault.zeroValue,
		expectedOutput: "0,000",
		expectedModelValue: 0,
		expectedModelTypeof: "number",
		expectedValueState: "None"
	})
	setModelPropertyTestCase("Should handle empty value", {
		type: sapType.QUAN,
		value: oDefault.emptyValue,
		expectedOutput: "0,000",
		expectedModelValue: "",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	})
	setModelPropertyTestCase("Should handle null value", {
		type: sapType.QUAN,
		value: oDefault.nullValue,
		expectedOutput: "",
		expectedModelValue: null,
		expectedModelTypeof: "object",
		expectedValueState: "None"
	})
	setModelPropertyTestCase("Should handle undefined value", {
		type: sapType.QUAN,
		value: oDefault.undefinedValue,
		expectedOutput: "",
		expectedModelValue: oDefault.undefinedValue,
		expectedModelTypeof: "undefined",
		expectedValueState: "None"
	})

	QUnit.module("Validate SAP type QUAN");

	invalidateValueTestCase("Should handle invalidation of value", {
		type: sapType.QUAN,
		value: "123,456",
		expectedOutput: "123,456",
		invalidValue: "something-invalid",
		expectedModelValue: 123.456,
		expectedValueState: "None"
	})

	QUnit.module("Parsing SAP type LENUM");
	
	setValueTestCase("Should handle long LENUM", {
		type: sapType.LENUM,
		value: "00000000109330000015",
		expectedOutput: "109330000015",
		expectedModelValue: "109330000015",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	setValueTestCase("Should handle short LENUM", {
		type: sapType.LENUM,
		value: "109330000015",
		expectedOutput: "109330000015",
		expectedModelValue: "109330000015",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	QUnit.module("Formatting SAP type LENUM");
	
	setModelPropertyTestCase("Should handle long LENUM", {
		type: sapType.LENUM,
		value: "109330000015",
		expectedOutput: "109330000015",
		expectedModelValue: "109330000015",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	QUnit.module("Validate SAP type LENUM");
	
	invalidateValueTestCase("Should handle invalidation of value", {
		type: sapType.LENUM,
		value: "00000000109330000015",
		expectedOutput: "109330000015",
		invalidValue: "ABC4567890",
		expectedModelValue: "109330000015",
		expectedValueState: "None"
	})

	QUnit.module("Parsing SAP type AUFNR");
	
	setValueTestCase("Should handle long AUFNR", {
		type: sapType.AUFNR,
		value: "000001234567",
		expectedOutput: "1234567",
		expectedModelValue: "1234567",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	setValueTestCase("Should handle short AUFNR", {
		type: sapType.AUFNR,
		value: "1234567",
		expectedOutput: "1234567",
		expectedModelValue: "1234567",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	QUnit.module("Formatting SAP type AUFNR");
	
	setModelPropertyTestCase("Should handle long AUFNR", {
		type: sapType.AUFNR,
		value: "1234567",
		expectedOutput: "1234567",
		expectedModelValue: "1234567",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	QUnit.module("Validate SAP type AUFNR");
	
	invalidateValueTestCase("Should handle invalidation of value", {
		type: sapType.AUFNR,
		value: "1234567",
		expectedOutput: "1234567",
		invalidValue: "2234567",
		expectedModelValue: "1234567",
		expectedValueState: "None"
	})

	QUnit.module("Parsing SAP type VORNR");
	
	setValueTestCase("Should handle long VORNR", {
		type: sapType.VORNR,
		value: "0012",
		expectedOutput: "0012",
		expectedModelValue: "0012",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	setValueTestCase("Should handle short VORNR", {
		type: sapType.VORNR,
		value: "12",
		expectedOutput: "0012",
		expectedModelValue: "0012",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	QUnit.module("Formatting SAP type VORNR");
	
	setModelPropertyTestCase("Should handle long VORNR", {
		type: sapType.VORNR,
		value: "0536",
		expectedOutput: "0536",
		expectedModelValue: "0536",
		expectedModelTypeof: "string",
		expectedValueState: "None"
	});
	
	QUnit.module("Validate SAP type VORNR");
	
	invalidateValueTestCase("Should handle invalidation of value", {
		type: sapType.VORNR,
		value: "1234",
		expectedOutput: "1234",
		invalidValue: "I234",
		expectedModelValue: "1234",
		expectedValueState: "None"
	})
	
});