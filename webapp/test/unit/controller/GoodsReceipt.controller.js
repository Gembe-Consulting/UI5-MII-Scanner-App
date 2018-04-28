sap.ui.define([
	"com/mii/scanner/controller/action/gm/GoodsReceipt.controller",
	"sap/ui/model/json/JSONModel"
], function(GoodsReceiptController, JSONModel) {
	"use strict";

	QUnit.module("Create and post Goods Receipts", {

		beforeEach: function() {
			this.oGoodsReceiptController = new GoodsReceiptController();
			sap.ui.getCore().applyChanges();
		},

		afterEach: function() {
			this.oGoodsReceiptController.destroy();
		}
	});

	QUnit.test("Should return if posting conditions are met", 9, function(assert) {
		//Prepare
		var oModel = new JSONModel();
		var oData = {
			LENUM: null,
			AUFNR: null,
			SOLLME: 0.0,
			MEINH: null,
			LGORT: ''
		};
		// Assert
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), false, "Should not be valid: " + JSON.stringify(oData));

		oData.LENUM = "100004711";
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), false, "Should not be valid: " + JSON.stringify(oData));

		oData.AUFNR = "104712";
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), false, "Should not be valid: " + JSON.stringify(oData));

		oData.SOLLME = "322";
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), false, "Should not be valid: " + JSON.stringify(oData));

		oData.MEINH = "XX";
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), false, "Should not be valid: " + JSON.stringify(oData));

		oData.LGORT = "RB01";
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), false, "Should not be valid: " + JSON.stringify(oData));

		oData.LGORT = "1000";
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), true, "Should be valid: " + JSON.stringify(oData));

		oData.LENUM = "";
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), false, "Should not be valid: " + JSON.stringify(oData));

		oData.LGORT = "RB02";
		assert.strictEqual(this.oGoodsReceiptController.isInputDataValid(oData), true, "Should be valid: " + JSON.stringify(oData));
	});

	QUnit.test("Should not allow VG01 as storage location, all others are allowed", 2, function(assert) {
		//Prepare

		// Assert
		assert.strictEqual(this.oGoodsReceiptController.isStorageLocationAllowed("VG01"), false, "Storage location VG01 should not be allowed.");
		assert.strictEqual(this.oGoodsReceiptController.isStorageLocationAllowed("1000"), true, "Storage location 1000 should be allowed.");
	});
});