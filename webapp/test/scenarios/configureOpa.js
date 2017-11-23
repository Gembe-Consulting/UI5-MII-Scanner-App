sap.ui.define([
	"sap/ui/test/Opa5",
	"com/mii/scanner/test/arrangement/Common",
	// QUnit additions
	"sap/ui/qunit/qunit-css",
	"sap/ui/qunit/qunit-junit",
	"sap/ui/qunit/qunit-coverage",
	// Page Objects
	"com/mii/scanner/test/pages/Login"
], function (Opa5, Common) {
	"use strict";

	Opa5.extendConfig({
		arrangements : new Common(),
		actions: new Opa5({
			iLookAtTheScreen : function () {
				return this;
			}
		}),
		viewNamespace : "com.mii.scanner.view.",
		autoWait: true
	});
});

