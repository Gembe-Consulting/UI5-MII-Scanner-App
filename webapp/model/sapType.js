sap.ui.define([
	"sap/ui/model/type/Float",
	"sap/ui/model/type/Integer",
	"sap/ui/model/type/String",
	"com/mii/scanner/model/type/StorageLocation",
	"com/mii/scanner/model/type/StorageUnitNumber",
	"com/mii/scanner/model/type/UnitOfMeasure",
	"com/mii/scanner/model/type/ProcessOrderNumber",
	"com/mii/scanner/model/type/OperationNumber"
], function(FloatType, IntegerType, StringType, StorageLocationType, StorageUnitNumberType, UnitOfMeasureType, ProcessOrderNumberType, OperationNumberType) {
	"use strict";

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

	return {

		QUAN: new FloatType({
			minIntegerDigits: 1, // minimal number of non-fraction digits
			maxIntegerDigits: 12, // maximal number of non-fraction digits
			minFractionDigits: 3, // minimal number of fraction digits
			maxFractionDigits: 3, // maximal number of fraction digits
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}, {
			minimum: Number.MIN_VALUE,
			maximum: Number.MAX_VALUE
		}),

		LENUM: new StorageUnitNumberType({
			emptyString: null, // defines what empty string is parsed as and what is formatted as empty string
			hideLeadingZeros: true // formatting hides leading zeros
		}, {
			minLength: 10,
			maxLength: 20,
			numericOnly: true // only number allowed
		}),

		LGORT: new StorageLocationType({
			toUpperCase: true, // converts input to upper case 
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}, {
			minLength: 4,
			maxLength: 4,
			exludedStorageLocations: ["VG01"] // throws an validation exception if entered
		}),

		AUFNR: new ProcessOrderNumberType({
			emptyString: null, // defines what empty string is parsed as and what is formatted as empty string
			hideLeadingZeros: true // formatting hides leading zeros
		}, {
			minLength: 7,
			maxLength: 12,
			startsWith: "000001",
			numericOnly: true // only number allowed
		}),

		VORNR: new OperationNumberType({
			padWithChar: "0", // defines the character that is used to pad to max length
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}, {
			minLength: 4,
			maxLength: 4,
			search: /^[0123456789]{4,4}$/
		}),

		MEINS: new UnitOfMeasureType({
			toUpperCase: true,
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}, {
			minLength: 1,
			maxLength: 4
		})

	};

});