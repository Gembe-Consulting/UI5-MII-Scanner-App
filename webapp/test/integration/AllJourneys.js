/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"com/mii/scanner/test/integration/pages/Common",
	"com/mii/scanner/test/integration/pages/Login",
	"com/mii/scanner/test/integration/pages/ActionPage",
	"com/mii/scanner/test/integration/pages/Scanner"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		timeout: 10,
		pollingInterval: 15,		
		viewNamespace: "com.mii.scanner.view.",
		autoWait: true
	});

	sap.ui.require([
		"com/mii/scanner/test/integration/journeys/DesktopLoginJourney",
		"com/mii/scanner/test/integration/journeys/MobileLoginJourney",
		"com/mii/scanner/test/integration/journeys/Navigation",
	], function() {
		QUnit.start();
	});
});