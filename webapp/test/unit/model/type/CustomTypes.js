sap.ui.define([
	"com/mii/scanner/model/type/StorageUnitNumber",
	"com/mii/scanner/model/type/StorageLocation",
	"com/mii/scanner/model/type/ProcessOrderNumber",
	"com/mii/scanner/model/type/OperationNumber",
	"com/mii/scanner/model/type/UnitOfMeasure",
	"com/mii/scanner/model/sapType"
], function(LENUM, LGORT, AUFNR, VORNR, UOM, sapType) {
	"use strict";

	var sStorageUnitNumberLong = "00000000109330000015";
	var sStorageUnitNumberShort = "109330000015";
	var sStorageUnitNumberPale = "90025311000000000000";
	var sStorageUnitNumberBeum = "90024811000000000000";
	
	QUnit.module("Storage Unit Number Type");

	QUnit.test("LENUM formatValue", function(assert) {
		var lenumType = sapType.LENUM;

		assert.strictEqual(lenumType.formatValue(sStorageUnitNumberLong, "string"), sStorageUnitNumberShort, "format test LENUM long");
		assert.strictEqual(lenumType.formatValue(sStorageUnitNumberShort, "string"), sStorageUnitNumberShort, "format test LENUM short");
		assert.strictEqual(lenumType.formatValue("", "string"), "", "format test LENUM empty");
		assert.strictEqual(lenumType.formatValue(" ", "string"), "", "format test LENUM blank");
		assert.strictEqual(lenumType.formatValue(null, "string"), "", "format test LENUM null");
		assert.strictEqual(lenumType.formatValue(undefined, "string"), "", "format test LENUM undefined");
	});

	QUnit.test("LENUM parseValue", function(assert) {
		var lenumType = sapType.LENUM;

		assert.strictEqual(lenumType.parseValue(sStorageUnitNumberLong, "string"), sStorageUnitNumberShort, "parse test LENUM long");
		assert.strictEqual(lenumType.parseValue(sStorageUnitNumberShort, "string"), sStorageUnitNumberShort, "parse test LENUM short");
		assert.strictEqual(lenumType.parseValue(sStorageUnitNumberPale, "string"), sStorageUnitNumberPale, "parse test dummy LENUM Palettierer");
		assert.strictEqual(lenumType.parseValue(sStorageUnitNumberBeum, "string"), sStorageUnitNumberBeum, "parse test dummy LENUM Beumer");
		assert.strictEqual(lenumType.parseValue("", "string"), "", "parse test LENUM empty");
		assert.strictEqual(lenumType.parseValue(" ", "string"), "", "parse test LENUM blank");
	});

	QUnit.test("LENUM validateValue", function(assert) {
		var lenumType = sapType.LENUM;

		lenumType.validateValue(sStorageUnitNumberPale);
		assert.ok(true, "Palettierer Dummy LENUM " + sStorageUnitNumberPale + " validated");

		lenumType.validateValue(sStorageUnitNumberBeum);
		assert.ok(true, "Beumer Dummy LENUM " + sStorageUnitNumberBeum + " validated");

		assert.throws(function() {
				lenumType.validateValue("100000000109330000015");
			},
			new sap.ui.model.ValidateException("Geben Sie einen Wert mit maximal 20 Zeichen ein"), "raised ValidateException (too long)"
		);

		assert.throws(function() {
				lenumType.validateValue("123456789");
			},
			new sap.ui.model.ValidateException("Geben Sie einen Wert mit mindestens 10 Zeichen ein"), "raised ValidateException (too short)"
		);

		assert.throws(function() {
				lenumType.validateValue("1234-456");
			},
			new sap.ui.model.ValidateException("Palettennummer '" + "1234-456" + "' ist nicht gültig"), "raised ValidateException (not a number)"
		);

		assert.throws(function() {
				lenumType.validateValue("");
			},
			new sap.ui.model.ValidateException("Palettennummer '" + "" + "' ist nicht gültig"), "raised ValidateException (empty)"
		);
		
		assert.throws(function() {
				lenumType.validateValue(" ");
			},
			new sap.ui.model.ValidateException("Palettennummer '" + " " + "' ist nicht gültig"), "raised ValidateException (blank/space)"
		);
	});
	
	QUnit.module("Storage Location Type");

	QUnit.test("LGORT formatValue", function(assert) {
		var lgortType = sapType.LGORT;

		assert.strictEqual(lgortType.formatValue("", "string"), "", "format test LGORT empty");
		assert.strictEqual(lgortType.formatValue(" ", "string"), "", "format test LGORT blank");
		assert.strictEqual(lgortType.formatValue(null, "string"), "", "format test LGORT null");
		assert.strictEqual(lgortType.formatValue(undefined, "string"), "", "format test LGORT undefined");
	});

	QUnit.test("LGORT parseValue", function(assert) {
		var lgortType = sapType.LGORT;
		
		assert.strictEqual(lgortType.parseValue("vg01", "string"), "VG01", "parse test LGORT to upper case");
		assert.strictEqual(lgortType.parseValue(" ", "string"), "", "parse test LGORT blank");
		assert.strictEqual(lgortType.parseValue("", "string"), "", "parse test LGORT empty");
	});

	QUnit.test("LGORT validateValue", function(assert) {
		var lgortType = sapType.LGORT;

		lgortType.validateValue("RB01");
		assert.ok(true, "Storage location validated");

		assert.throws(function() {
				lgortType.validateValue("VG01");
			},
			new sap.ui.model.ValidateException("Lagerort 'VG01' ist nicht erlaubt"), "raised ValidateException (forbidden storage location provided as array)"
		);

		assert.throws(function() {
				lgortType.validateValue("ABC12");
			},
			new sap.ui.model.ValidateException("Geben Sie einen Wert mit maximal 4 Zeichen ein"), "raised ValidateException (too long)"
		);

		assert.throws(function() {
				lgortType.validateValue("ABC");
			},
			new sap.ui.model.ValidateException("Geben Sie einen Wert mit mindestens 4 Zeichen ein"), "raised ValidateException (too short)"
		);
		
		var lgortType2 = new LGORT({
			toUpperCase: true, // converts input to upper case 
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}, {
			minLength: 4,
			maxLength: 4,
			exludedStorageLocations: "XY11" // throws an validation exception if entered
		});
	
		assert.throws(function() {
				lgortType2.validateValue("XY11");
			},
			new sap.ui.model.ValidateException("Lagerort 'XY11' ist nicht erlaubt"), "raised ValidateException (forbidden storage location provides as string)"
		);
		
	});
	
	QUnit.module("Process Order Number Type");

	QUnit.test("AUFNR formatValue", function(assert) {
		var aufnrType = sapType.AUFNR;

		assert.strictEqual(aufnrType.formatValue("000001234567", "string"), "1234567", "format test AUFNR '000001234567' -> '1234567'");
		assert.strictEqual(aufnrType.formatValue("", "string"), "", "format test AUFNR empty");
		assert.strictEqual(aufnrType.formatValue(" ", "string"), "", "format test AUFNR blank");
		assert.strictEqual(aufnrType.formatValue(null, "string"), "", "format test AUFNR null");
		assert.strictEqual(aufnrType.formatValue(undefined, "string"), "", "format test AUFNR undefined");
	});

	QUnit.test("AUFNR parseValue", function(assert) {
		var aufnrType = sapType.AUFNR;
		
		assert.strictEqual(aufnrType.parseValue("1234567", "string"), "1234567", "parse test AUFNR '1234567' -> '1234567'");
		assert.strictEqual(aufnrType.parseValue("", "string"), "", "parse test AUFNR empty");
		assert.strictEqual(aufnrType.parseValue(" ", "string"), "", "parse test AUFNR blank");
	});

	QUnit.test("AUFNR validateValue", function(assert) {
		var aufnrType = sapType.AUFNR;

		aufnrType.validateValue("1093300");
		assert.ok(true, "Process Order Number 000001093300 validated");

		assert.throws(function() {
				aufnrType.validateValue("2093300");
			},/Geben Sie einen Wert ein, der mit \"1\" beginnt/, "raised ValidateException (not starting with '1')"
		);
		
		assert.throws(function() {
				aufnrType.validateValue("I234567");
			},
			new sap.ui.model.ValidateException("Auftragsnummer 'I234567' ist nicht gültig"), "raised ValidateException (not a number)"
		);	
		
		assert.throws(function() {
				aufnrType.validateValue("00000110933000");
			},/Geben Sie einen Wert mit maximal 12 Zeichen ein/, "raised ValidateException (too long)"
		);
		assert.throws(function() {
				aufnrType.validateValue("000001");
			},/Geben Sie einen Wert mit mindestens 7 Zeichen ein/, "raised ValidateException (too short)"
		);
	});

	QUnit.module("Order Operation Number Type");

	QUnit.test("VORNR formatValue", function(assert) {
		var vornrType = sapType.VORNR;

		assert.strictEqual(vornrType.formatValue("0012", "string"), "0012", "format test VORNR '0012' -> '0012'");
		assert.strictEqual(vornrType.formatValue("", "string"), "", "format test VORNR empty");
		assert.strictEqual(vornrType.formatValue(" ", "string"), "", "format test VORNR blank");
		assert.strictEqual(vornrType.formatValue(null, "string"), "", "format test VORNR null");
		assert.strictEqual(vornrType.formatValue(undefined, "string"), "", "format test VORNR undefined");
	});

	QUnit.test("VORNR parseValue", function(assert) {
		var vornrType = sapType.VORNR;
		
		assert.strictEqual(vornrType.parseValue("12", "string"), "0012", "parse test VORNR '12' -> '0012'");
		assert.strictEqual(vornrType.parseValue("", "string"), "", "parse test VORNR empty");
		assert.strictEqual(vornrType.parseValue(" ", "string"), "", "parse test VORNR blank");
	});

	QUnit.test("VORNR validateValue", function(assert) {
		var vornrType = sapType.VORNR;

		vornrType.validateValue("0010");
		assert.ok(true, "Order Operation Number 0010 validated");

		assert.throws(function() {
				vornrType.validateValue("XYZ1");
			},
			new sap.ui.model.ValidateException("Vorgangsnummer 'XYZ1' ist nicht gültig"), "raised ValidateException (not a number)"
		);	
		
		assert.throws(function() {
				vornrType.validateValue("12345");
			},/Geben Sie einen Wert mit maximal 4 Zeichen ein/, "raised ValidateException (too long)"
		);
		assert.throws(function() {
				vornrType.validateValue("123");
			},/Geben Sie einen Wert mit mindestens 4 Zeichen ein/, "raised ValidateException (too short)"
		);
	});
	
});