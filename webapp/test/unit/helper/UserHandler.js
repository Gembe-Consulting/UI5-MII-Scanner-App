sap.ui.define([
	"com/mii/scanner/controller/helper/UserHandler",
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel",
	"sap/ui/app/MockServer",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(UserHandler, ManagedObject, JSONModel, MockServer) {
	"use strict";
	/* eslint-disable */
	
	QUnit.module("UserHandler", {

		beforeEach: function() {

			this.oComponentStub = new ManagedObject();
			this.oComponentStub.showBusyIndicator = sinon.stub(); //sinon.stub(this.oComponent, "showBusyIndicator").returns(this.oComponentStub);
			this.oComponentStub.hideBusyIndicator = sinon.stub(); //sinon.stub(this.oComponent, "hideBusyIndicator").returns(this.oComponentStub);
			this.oComponentStub.getModel = sinon.stub();
			this.oComponentStub.getDebugMode = sinon.stub();

			this.oValidUserModel = new JSONModel({
				USERLOGIN: "PHIGEM"
			});

			this.oEmptyUserModel = new JSONModel({});

			this.oDesktopDeviceModel = new JSONModel({
				browser: {
					mobile: false
				},
				system: {
					desktop: true,
					phone: false
				}
			});

			this.oMobileDeviceModel = new JSONModel({
				browser: {
					mobile: true
				},
				system: {
					desktop: false,
					phone: true
				}
			});

			this.oUserHandler = new UserHandler(this.oComponentStub);
		},

		afterEach: function() {
			this.oUserHandler.destroy();
			this.oComponentStub.destroy();
			this.oValidUserModel.destroy();
			this.oEmptyUserModel.destroy();
			this.oDesktopDeviceModel.destroy();
			this.oMobileDeviceModel.destroy();
		}
	});

	QUnit.test("Should pass test if user is logged in", 3, function(assert) {

		this.oComponentStub.getDebugMode.returns(true);

		this.oComponentStub.getModel.returns(this.oValidUserModel);
		assert.strictEqual(this.oUserHandler.isUserLoggedIn(), true, "true, with user model in debug mode");

		this.oComponentStub.getModel.returns(this.oEmptyUserModel);
		assert.strictEqual(this.oUserHandler.isUserLoggedIn(), true, "true, even without user model in debug mode, ");

		this.oComponentStub.getDebugMode.returns(false);

		this.oComponentStub.getModel.returns(this.oValidUserModel);
		assert.strictEqual(this.oUserHandler.isUserLoggedIn(), true, "true, with user model in non-debug mode");
	});

	QUnit.test("Should detect an missing user login", 3, function(assert) {

		this.oComponentStub.getDebugMode.returns(false);

		this.oComponentStub.getModel.returns(null);
		assert.strictEqual(this.oUserHandler.isUserLoggedIn(), false, "false, without user model in non-debug mode");

		this.oComponentStub.getModel.returns(this.oEmptyUserModel);
		assert.strictEqual(this.oUserHandler.isUserLoggedIn(), false, "false, with empty user model in non-debug mode");

		this.oEmptyUserModel.setProperty("/USERLOGIN", "");
		this.oComponentStub.getModel.returns(this.oEmptyUserModel);
		assert.strictEqual(this.oUserHandler.isUserLoggedIn(), false, "false, with empty USERLOGIN parameter in user model in non-debug mode");
	});

	QUnit.test("Should test if discovery succeeds if IllumLoginName is provided", 1, function(assert) {
		// Arrange
		/* eslint-disable sap-no-dom-insertion*/
		$("#content").append('<input type="hidden" id="IllumLoginName" name="IllumLoginName" value="FooBar" />');
		/* eslint-enable sap-no-dom-insertion*/

		this.oComponentStub.getModel.returns(this.oDesktopDeviceModel);

		var done = assert.async();

		this.oUserHandler.discoverIllumLoginName().then(function(sUsername) {
			assert.strictEqual(sUsername, "FooBar", "promise resolved with IllumLoginName 'FooBar'");
			done();
		}).finally(function() {
			$("#content").empty();
		});

	});

	QUnit.test("Should test if discovery fails if IllumLoginName is empty", 1, function(assert) {
		/* eslint-disable sap-no-dom-insertion*/
		$("#content").append('<input type="hidden" id="IllumLoginName" name="IllumLoginName" value="" />');
		/* eslint-enable sap-no-dom-insertion*/

		this.oComponentStub.getModel.returns(this.oDesktopDeviceModel);

		var sExpectedErrorMessage = "Could not read #IllumLoginName";

		var done = assert.async();

		var fnCallback = function(oError) {
			assert.strictEqual(oError.message, sExpectedErrorMessage, "promise rejected with error message '" + sExpectedErrorMessage + "'");
			done();
		};

		this.oUserHandler.discoverIllumLoginName().then(fnCallback, fnCallback).finally(function() {
			$("#content").empty();
		});

	});

	QUnit.test("Should test if discovery fails if called from non-desktop device", 1, function(assert) {
		/* eslint-disable sap-no-dom-insertion*/
		$("#content").append('<input type="hidden" id="IllumLoginName" name="IllumLoginName" value="FooBar" />');
		/* eslint-enable sap-no-dom-insertion*/

		this.oComponentStub.getModel.returns(this.oMobileDeviceModel);

		var sExpectedErrorMessage = "This is a mobile device, we are not allowed to read #IllumLoginName";

		var done = assert.async();

		var fnCallback = function(oError) {
			assert.strictEqual(oError.message, sExpectedErrorMessage, "promise rejected with error message '" + sExpectedErrorMessage + "'");
			done();
		};

		this.oUserHandler.discoverIllumLoginName().then(fnCallback, fnCallback).finally(function() {
			$("#content").empty();
		});
	});

	QUnit.test("Should Test 'testUserLoginName'", function(assert) {
		assert.ok(false, "testUserLoginName: Implement me");
	});

	QUnit.test("Should Test 'getUserLoginName'", function(assert) {
		assert.ok(false, "getUserLoginName: Implement me");
	});

	QUnit.test("Should Test 'resetUserModel'", function(assert) {
		assert.ok(false, "resetUserModel: Implement me");
	});
	
	/*
		function startMockServer(iRespondAfter) {
			// configure respond to requests delay
			sap.ui.app.MockServer.config({
				autoRespond: true,
				autoRespondAfter: iRespondAfter || 10
			});

			// create mockserver
			var oMockServer = new MockServer({
				rootUri: "/my/mii/service/"
			});

			var sJSON = jQuery.sap.syncGetJSON("../localService/mockdata/FindScannerUserQry.json");

			// start and return
			oMockServer.simulate("../../localService/metadata.xml", {
				sMockdataBaseUrl: "../localService/mockdata/FindScannerUserQry.json",
				bGenerateMissingMockData: false
			});
			
			oMockServer.start();
			return oMockServer;
		}

		function createDataModel(sURL, mSettings) {
			sURL = sURL || "/my/mii/service/";
			var oModel = new JSONModel(sURL);

			mSettings = mSettings || {};
			jQuery.each(mSettings, function(sProperty, vValue) {
				sProperty = jQuery.sap.charToUpperCase(sProperty);
				oModel["set" + sProperty](vValue);
			});

			return oModel;
		}

		QUnit.test("Should do something with the model", function(assert) {
			// Arrange
			var 
				oMockServer = startMockServer(0),
				oModel = createDataModel(),
				done = assert.async();

			// System under Test
			var oLabel = new sap.m.Label({
				text: "{/myProperty}"
			});

			oLabel.placeAt("content");
			sap.ui.getCore().applyChanges();

			// Act - trigger the request + call done();
			sinon.clock.tick(50);

			// Assert
			assert.strictEqual("myExpected", oLabel.getText(), "The expected text was present");

			// Cleanup
			oModel.destroy();
			oMockServer.stop();
			sinon.clock.reset();
		});
		*/
});