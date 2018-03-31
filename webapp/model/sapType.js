sap.ui.define([
	"sap/ui/model/type/Float",
	"sap/ui/model/type/Integer",
	"sap/ui/model/type/String",
	"com/mii/scanner/model/type/StorageLocation",
	"com/mii/scanner/model/type/StorageUnitNumber",
	"com/mii/scanner/model/type/UnitOfMeasure",
	"com/mii/scanner/model/type/ProcessOrderNumber"
], function(FloatType, IntegerType, StringType, StorageLocationType, StorageUnitNumberType, UnitOfMeasureType, ProcessOrderNumberType) {
	"use strict";

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
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}, {
			minLength: 12,
			maxLength: 20
		}),

		LGORT: new StorageLocationType({
			toUpperCase: true,
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}, {
			minLength: 4,
			maxLength: 4,
			exludedStorageLocations: ["VG01"]
		}),

		AUFNR: new ProcessOrderNumberType({
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}, {
			minLength: 7,
			maxLength: 12,
			startsWith: "1"
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