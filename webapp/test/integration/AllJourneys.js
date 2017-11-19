/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;


sap.ui.require([
	"sap/ui/test/Opa5",
	"com/mii/scanner/test/integration/pages/Common",
	"com/mii/scanner/test/integration/pages/Login"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.mii.scanner.view.",
		autoWait: true
	});

	sap.ui.require([
		"com/mii/scanner/test/integration/LoginJourney"
	], function () {
		QUnit.start();
	});
});
