sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	QUnit.module("BaseController", {

		beforeEach: function() {
			this.BaseController = new BaseController();
		},

		afterEach: function() {
			this.BaseController.destroy();
		}
	});

	QUnit.test("Should have description", function(assert) {
		assert.ok(false, "Implement me");
	});
});