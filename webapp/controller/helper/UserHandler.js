sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object"
], function(jQuery, UI5Object) {
	"use strict";

	return UI5Object.extend("com.mii.scanner.controller.helper.UserHandler", {

		/**
		 * Handles user login
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias com.mii.scanner.controller.UserHandler
		 */
		constructor: function(oComponent) {
			this.oComponent = oComponent;
		},

		/** 
		 * Checks if a user model is present or app is in debug mode
		 * If debug mode is detected, we set a dummy user model
		 * 
		 * @returns {boolean} true if a user model has been set or app is in debug mode
		 */
		isUserLoggedIn: function() {
			var oModel = this.oComponent.getModel("user");

			//always return true if we are in debug mode
			if (this.oComponent.getDebugMode()) {
				oModel.setProperty("/USERLOGIN", "SUW_MII_DEBUG");

				return true;
			}

			if (!oModel || !oModel.getProperty("/USERLOGIN") || oModel.getProperty("/USERLOGIN") === "") {
				jQuery.sap.log.warning("User nicht angemeldet", "this.getModel('user') undefined or property USERLOGIN not given or empty.", this.toString());

				return false;
			}

			return true;
		},

		/**
		 * Retrieve the IllumLoginName set by SAP NetWeaver per autobinding into DOM
		 * <input type="hidden" id="IllumLoginName" name="IllumLoginName" value="{IllumLoginName}" />
		 * 
		 * @returns {Promise<string>} When resolved, a promise that contains the username from MII.
		 * @reject {NotFoundError} IllumLoginName has not been found in DOM.
		 * @reject {MobileDeviceError} Current device is a mobile device, which is not allowed for username discovery.
		 */
		discoverIllumLoginName: function discoverIllumLoginName() {
			var oDiscoverdIllumLoginName,
				bIsMobileDevice = this.oComponent.getModel("device").getProperty("/system/phone"),
				sIllumLoginName;

			oDiscoverdIllumLoginName = new Promise(function(resolve, reject) {
				
				if (!bIsMobileDevice) {
					sIllumLoginName = $("#IllumLoginName").val();
					if (sIllumLoginName) {

						resolve(sIllumLoginName);

						return;
					}

					reject(new Error("Could not read #IllumLoginName"));

				}

				reject(new Error("This is a mobile device, we are not allowed to read #IllumLoginName"));

			});

			return oDiscoverdIllumLoginName;
		},

		/**
		 * @param {string} sUserInput username to be tested
		 * @returns {Promise} a promise: 
		 *  - If resolved the user name was found in MII. 
		 *  - If rejected, user was not found.
		 * A promise can be:
		 *	- fulfilled - The action relating to the promise succeeded
		 *	- rejected - The action relating to the promise failed
		 *	- pending - Hasn't fulfilled or rejected yet
		 *	- settled - Has fulfilled or rejected
		 * 
		 * see https://scotch.io/tutorials/javascript-promises-for-dummies
		 * 
		 */
		testUserLoginName: function(sUserInput) {
			var sUserInputUpper = sUserInput ? sUserInput.toUpperCase() : "",
				validateUserLoginName,
				updateUserModel,
				onLoginError;

			this.oComponent.showBusyIndicator();

			validateUserLoginName = function(oLoginResult) {
				var oUser;

				try {
					oUser = oLoginResult.d.results[0].Rowset.results[0].Row.results[0];
				} catch (oError) {
					jQuery.sap.log.error("Das Resultset enthält keine Benutzerdaten!", [oError], this.toString());

					return Promise.reject(oError);
				}

				if (oUser && oUser.USERLOGIN === sUserInputUpper) {

					return oUser;
				}

				return Promise.reject("Der zurückgegeben Username entspricht nicht der Benutzereingabe!", [], this.toString());

			}.bind(this);

			updateUserModel = function(oUser) {
				this.oComponent.getModel("user").setProperty("/", oUser);
			}.bind(this);

			onLoginError = function(oError) {
				this.resetUserModel({});
				this.oComponent.hideBusyIndicator();
				throw oError; //re-throw to inform Login about error
			}.bind(this);

			return this.getUserLoginName(sUserInputUpper)
				.then( /*onFulfilled*/ validateUserLoginName)
				.then( /*onFulfilled*/ updateUserModel)
				.catch( /*onRejected*/ onLoginError)
				.then( /*onFulfilled*/ this.oComponent.hideBusyIndicator);
		},

		/**
		 * @return a Promise containig user data {__metadata: {…}, USERLOGIN: string, USERNNAME: string || null, USERVNAME: string || null, RowId: int}
		 * It may, or may not contain the user data. Its on the caller to check this.
		 */
		getUserLoginName: function(sUserInput) {
			var oModel = this.oComponent.getModel("user"),
				oParam = {
					"Param.1": sUserInput
				};

			return oModel.loadMiiData(oModel._sServiceUrl, oParam);
		},

		resetUserModel: function(oObject) {
			var oEmpty = oObject || {};

			return this.oComponent.getModel("user").setProperty("/", oEmpty);
		},

		forceRedirectToLoginPage: function(oError) {
			this.resetUserModel();
			this.oComponent.getRouter().navTo("forbidden", {}, true /*bReplace*/ );
		}
	});
});