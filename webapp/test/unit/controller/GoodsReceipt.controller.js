sap.ui.define([
		"com/mii/scanner/controller/action/GoodsReceipt.controller"
	], function(GoodsReceiptController) {
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
		
		QUnit.test("Should not allow VG01 as storage location, all others are allowed", 2, function (assert) {
			// Assert
			assert.strictEqual(this.oGoodsReceiptController.isStorageLocationAllowed("VG01"), false, "Storage location VG01 should not be allowed.");
			assert.strictEqual(this.oGoodsReceiptController.isStorageLocationAllowed("1000"), true, "Storage location 1000 should be allowed.");
		});
	}
);