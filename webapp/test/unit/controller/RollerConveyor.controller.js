sap.ui.define([
	"com/mii/scanner/controller/action/RollerConveyor.controller",
	"sap/ui/model/json/JSONModel"
], function(RollerConveyorController, JSONModel) {
	"use strict";

	QUnit.module("Create and post Goods Receipts", {

		beforeEach: function() {
			this.oRollerConveyorController = new RollerConveyorController();
			sap.ui.getCore().applyChanges();
		},

		afterEach: function() {
			this.oRollerConveyorController.destroy();
		}
	});

	QUnit.test("Should return correct ressource id by given storage bin", 2, function(assert) {
		/*
			[{
				BEUM: "00248110"
			}, {
				PALE: "00253110"
			}]
		*/
		//Prepare
		var sBEUM = "BEUM", sR1 = "00248110",
			sPALE = "PALE", sR2 = "00253110";

		// Assert
		
		assert.strictEqual(this.oRollerConveyorController.findRessourceOfStorageBin(sBEUM), sR1, "Storage Bin " + sBEUM + " resolves to ressource " + sR1);
		assert.strictEqual(this.oRollerConveyorController.findRessourceOfStorageBin(sPALE), sR2, "Storage Bin " + sPALE + " resolves to ressource " + sR2);
	});
});