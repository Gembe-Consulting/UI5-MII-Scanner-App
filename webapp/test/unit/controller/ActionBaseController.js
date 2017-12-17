sap.ui.define([
		"com/mii/scanner/controller/action/ActionBaseController"
	], function(ActionBaseController) {
		"use strict";
		
			
		QUnit.module("Detect barcode scanner Input Type", {

			beforeEach: function() {
				this.oActionBaseController = new ActionBaseController();
			},

			afterEach: function() {
				this.oActionBaseController.destroy();
			}
		});
	
		function scannedBarcodeInputTestCase(oOptions) {
			// Act
			var oBarcodeType = this.oActionBaseController.getScannerInputType(oOptions.input);
			
			// Assert
			oOptions.assert.strictEqual(oBarcodeType, oOptions.expected, "Barcode value " + oOptions.input + " is a " + oBarcodeType.name);
		}
		
		function scannedBarcodeInputAnitTestCase(oOptions) {
			// Act
			var oBarcodeType = this.oActionBaseController.getScannerInputType(oOptions.input);
			
			// Assert
			oOptions.assert.strictEqual(oBarcodeType, oOptions.expected, "Barcode value " + oOptions.input + " is not a match to any type");
		}

		QUnit.test("Should detect 00000000109330000001 as storage unit number", 1, function (assert) {
			scannedBarcodeInputTestCase.call(this, {
				assert: assert,
				input: "00000000109330000001",
				expected: this.oActionBaseController.mScannerInputTypes.storageUnit
			});
		});
		
		QUnit.test("Should detect 109330000001 as storage unit number", 1, function (assert) {
			scannedBarcodeInputTestCase.call(this, {
				assert: assert,
				input: "109330000001",
				expected: this.oActionBaseController.mScannerInputTypes.storageUnit
			});
		});	
		
		QUnit.test("Should NOT detect 0000000109330000001 as storage unit number (leading zeros length -1)", 1, function (assert) {
			scannedBarcodeInputAnitTestCase.call(this, {
				assert: assert,
				input: "0000000109330000001",
				expected: undefined
			});
		});	
		QUnit.test("Should NOT detect 000000000109330000001 as storage unit number (leading zeros length +1)", 1, function (assert) {
			scannedBarcodeInputAnitTestCase.call(this, {
				assert: assert,
				input: "000000000109330000001",
				expected: undefined
			});
		});	
		
		QUnit.test("Should NOT detect 10933000001 as storage unit number (length 11)", 1, function (assert) {
			scannedBarcodeInputAnitTestCase.call(this, {
				assert: assert,
				input: "10933000001",
				expected: undefined
			});
		});	
		
		QUnit.test("Should NOT detect 209330000001 as storage unit number (starts with 2)", 1, function (assert) {
			scannedBarcodeInputAnitTestCase.call(this, {
				assert: assert,
				input: "209330000001",
				expected: undefined
			});
		});	
		QUnit.test("Should NOT detect 10933000O00I as storage unit number (non digit char O and I)", 1, function (assert) {
			scannedBarcodeInputAnitTestCase.call(this, {
				assert: assert,
				input: "10933000O00I",
				expected: undefined
			});
		});	
		QUnit.test("Should detect VG01 as storage location", 1, function (assert) {
			scannedBarcodeInputTestCase.call(this, {
				assert: assert,
				input: "VG01",
				expected: this.oActionBaseController.mScannerInputTypes.storageLocation
			});
		});	
		
	}
);