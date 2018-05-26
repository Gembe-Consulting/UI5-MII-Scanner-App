sap.ui.define([
	"com/mii/scanner/controller/action/gm/GoodsIssue.controller",
	"sap/ui/base/ManagedObject",
	"sap/ui/core/Control",
	"sap/ui/core/Element",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/Controller",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(GoodsIssueController, ManagedObject, Control, Element, View, Controller /*, sinon, sinonQunit*/ ) {
	"use strict";
	/* eslint-disable */
	
	QUnit.module("GoodsIssueController", {

		beforeEach: function() {
			// System under Test
			this.oGoodsIssueController = new GoodsIssueController();

			this.oViewStub = new View({});
			this.oComponentStub = new Control();

			sinon.stub(Controller.prototype, "getOwnerComponent").returns(this.oComponentStub);
			sinon.stub(Controller.prototype, "getView").returns(this.oViewStub);

			sinon.stub(this.oGoodsIssueController, "attachRouteMatched");
		},

		afterEach: function() {
			Controller.prototype.getView.restore();
			Controller.prototype.getOwnerComponent.restore();

			this.oGoodsIssueController.destroy();
			this.oViewStub.destroy();
			this.oComponentStub.destroy();
		}
	});

	QUnit.test("I should test the GoodsIssue controller", function(assert) {
		//Arrange
		var oExpectedViewData = {
			bStorageUnitValid: true,
			bOrderNumberValid: true,
			bValid: false,
			storageUnitValueState: sap.ui.core.ValueState.None,
			orderNumberValueState: sap.ui.core.ValueState.None,
			materialNumberValueState: sap.ui.core.ValueState.None
		};

		var oExpectedDisallowedSLocs = ["VG01", "1000"];

		var oExpectedData = {
			entryQuantity: null,
			unitOfMeasure: null,
			orderNumber: null,
			storageUnit: null,
			storageLocation: null,
			materialNumber: null,
			bulkMaterialIndicator: false,
			LENUM: null,
			MEINH: null,
			BESTQ: null,
			VFDAT: null
		};

		//System under test

		// Act
		this.oGoodsIssueController.onInit();
		var oDataModel = this.oGoodsIssueController.getModel("data");
		var oViewModel = this.oGoodsIssueController.getModel("view");

		//Assert
		assert.ok(this.oGoodsIssueController, "GoodsIssue Controller is implemented");
		assert.ok(!!oDataModel, "Data Model is implemented");
		assert.ok(!!oViewModel, "View Model is implemented");
		assert.strictEqual(this.oGoodsIssueController._oInitData, oExpectedData, "Main Data is inital");
		assert.strictEqual(this.oGoodsIssueController._oInitViewData, oExpectedViewData, "View data is inital");
		assert.strictEqual(this.oGoodsIssueController._aDisallowedStorageLocations, oExpectedDisallowedSLocs, "Disallowed storage locations are: " + oExpectedDisallowedSLocs.join(", "));
	});
});