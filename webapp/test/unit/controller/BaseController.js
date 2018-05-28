sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";
	/* eslint-disable */
	
	QUnit.module("BaseController", {

		beforeEach: function() {
			this.BaseController = new BaseController();
		},

		afterEach: function() {
			this.BaseController.destroy();
		}
	});

	QUnit.test("BaseController Should be implemented", function(assert) {
		assert.ok(!!this.BaseController, "BaseController is implemented");
	});
});