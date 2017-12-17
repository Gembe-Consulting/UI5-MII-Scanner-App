sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/mii/scanner/model/models",
	"com/mii/scanner/controller/ErrorHandler"
], function(UIComponent, Device, models, ErrorHandler) {
	"use strict";

	return UIComponent.extend("com.mii.scanner.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the FLP and device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);

			this.S_USERLOGIN_PARAM_NAME = "USERLOGIN";
			this.S_ILLUMLOGINNAME_URL_PARAM_NAME = "IllumLoginName";

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.setupSpaceAndTime();

			this.setupScannerDetection();

			// create the views based on the url/hash
			this.getRouter().initialize();

			// note: must run after Router initialization!
			//this.checkRemoteUserLoginByUrlParam();

			// this.getRouter().attachRouteMatched(function(oEvent) {
			// 	var bForce = true,
			// 		sCurrentHash = this.oHashChanger.getHash(),
			// 		sDefaultHash = this._oOwner._getDefaultRoutePattern("login");

			// 	if (!this._oOwner.isUserLoggedIn()) {
			// 		if (sDefaultHash !== sCurrentHash) {
			// 			//Set last denied hash, if last denied hash is still initial (first unauthorizes attempt)
			// 			this._lastDeniedIntendetHash = this._lastDeniedIntendetHash ? this._lastDeniedIntendetHash : sCurrentHash;
			// 			// redirect to login page, if we are not already on it
			// 			this.oHashChanger.setHash(sDefaultHash);
			// 		}
			// 	}

			// 	if (this._oOwner.isUserLoggedIn()) {

			// 		//update user model to reflect login time
			// 		this._oOwner.getModel("user").updateBindings(bForce);
			// 		// restore previous hash, if its not login page
			// 		if (this._lastDeniedIntendetHash && (sDefaultHash !== sCurrentHash)) {
			// 			this.oHashChanger.setHash(this._lastDeniedIntendetHash);
			// 			this._lastDeniedIntendetHash = null;
			// 		}
			// 	}
			// });

			// purge username from user modele, once login page is displayed
			// remove username from URL parameters
			this.getRouter().getTarget("login").attachDisplay(function(oEvent) {
				var sUserName = this._getRemoteUsername(),
					sUrlParam,
					sUrlCleaned;
				this.getModel("user").setProperty("/", {});

				if (sUserName) {
					sUrlParam = this.S_ILLUMLOGINNAME_URL_PARAM_NAME + "=" + sUserName;
					sUrlCleaned = window.location.href.replace(sUrlParam, "");

					window.history.replaceState({}, document.title, sUrlCleaned);
				}

			}.bind(this));

			// set the browser page title based on navigation
			this.getRouter().attachTitleChanged(function(oEvent) {
				document.title = oEvent.getParameter("title");
			});

		},
		/**
		 * This method checks if there is an url parameter containing the user object.
		 * If this is the case, we will load the "user" model data from MII.
		 * We then try to redirect to the intendet page.
		 */
		checkRemoteUserLoginByUrlParam: function() {
			var sRemoteUserId = this._getRemoteUsername(),
				oParams,
				oModel;

			// If remote user was given, we load the data of our user Model, and check if the given parameter is a valid MII user
			// This is not security!

			if (sRemoteUserId) { //.then(fnResolveHandler, fnRejectHandler)
				this.testUserLoginName(sRemoteUserId).then(function() {
						//continue navigation
						//this.getRouter().navTo("home");
					}.bind(this),
					function() {
						this.getRouter().navTo("login", {}, true);
					}.bind(this));
			}
		},

		_getRemoteUsername: function() {
			var oParameters = jQuery.sap.getUriParameters(window.location.href),
				sRemoteUserId = oParameters.get(this.S_ILLUMLOGINNAME_URL_PARAM_NAME);

			return sRemoteUserId;
		},

		/**
		 * @return a promise: 
		 *  - If resolved the user name was found in MII. 
		 *  - If rejected, user was not found.
		 * A promise can be:
		 *	- fulfilled - The action relating to the promise succeeded
		 *	- rejected - The action relating to the promise failed
		 *	- pending - Hasn't fulfilled or rejected yet
		 *	- settled - Has fulfilled or rejected
		 */
		testUserLoginName: function(sUserInput) {
			var sUserInput = sUserInput ? sUserInput : this._getRemoteUsername(),
				sUserInputUpper = sUserInput ? sUserInput.toUpperCase() : "",
				oModel = this.getModel("user"),
				oLoginUser,
				that = this;

			this.showBusyIndicator();

			return new Promise(function(fulfill, reject) {

				this._getUserLogin(sUserInputUpper)
					.then(function(oData) {
							oLoginUser = oModel.getProperty("/d/results/0/Rowset/results/0/Row/results/0/");
							if (that._validateUserData(oLoginUser, sUserInputUpper)) {
								// resolve promise
								fulfill(that._setUserModel(oLoginUser));
							} else {
								oModel.setProperty("/", {});
								reject(new Error("Username '" + sUserInput + "' not found!"));
							}
						},
						function(oError) {
							reject(oError);
						})
					.then(this.hideBusyIndicator);
			}.bind(this));
		},

		_setUserModel: function(oLoginUser) {
			var oModel = this.getModel("user");
			// enhance user Model
			oLoginUser.lastLoginTimestamp = new Date();
			// Set user model
			oModel.setProperty("/", oLoginUser);

			return oLoginUser;
		},

		/**
		 * @return a Promise containig user data {__metadata: {…}, USERLOGIN: string, USERNNAME: string || null, USERVNAME: string || null, RowId: int}
		 * It may, or may not contain the user data. Its on the caller to check this.
		 */
		_getUserLogin: function(sUserInput) {
			var oModel = this.getModel("user"),
				oParam = {
					"Param.1": sUserInput
				};

			return oModel.loadMiiData(oModel._sServiceUrl, oParam);

		},

		/**
		 * Compares the USERLOGIN against user input
		 */
		_validateUserData: function(oUser, sUserInput) {
			// if user was not found, oUser is undefined
			return oUser && oUser.USERLOGIN === sUserInput;
		},

		setupScannerDetection: function() {
			jQuery(document).scannerDetection({
				onComplete: function(sString) {
					alert(sString);
				},
				onError: function(event) { // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
					jQuery.sap.log.error("Scan war nicht erfolgreich: " + event.toString(), "Event: onError", "ScannerDetection");
				},
				onReceive: function(event, a, b, c) { // Callback after receiving and processing a char (scanned char in parameter)
					jQuery.sap.log.info("Key stroke detected from Scanner: " + event.key + " (" + event.keyCode + ")", "Event: onReceive", "ScannerDetection");
				},
				onKeyDetect: function(event) { // Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
					jQuery.sap.log.debug("Key stroke detected: " + event.key + " (" + event.keyCode + ")", "Event: onKeyDetect", "ScannerDetection");
				},
				timeBeforeScanTest: 100, // Wait duration (ms) after keypress event to check if scanning is finished. default: 100
				avgTimeByChar: 30, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning. default : 30
				minLength: 6, // Minimum length for a scanning. default: 6
				endChar: [13], // Chars to remove and means end of scanning
				startChar: [], // Chars to remove and means start of scanning
				ignoreIfFocusOn: false, // do not handle scans if the currently focused element matches this selector
				scanButtonKeyCode: false, // Key code of the scanner hardware button (if the scanner button a acts as a key itself) 
				scanButtonLongPressThreshold: 3, // How many times the hardware button should issue a pressed event before a barcode is read to detect a longpress
				onScanButtonLongPressed: false, // Callback after detection of a successfull scan while the scan button was pressed and held down
				stopPropagation: false, // Stop immediate propagation on keypress event
				preventDefault: false // Prevent default action on keypress event
			});
		},

		/**
		 * Set the current Language Code / Locale
		 * SAPUI5 has the notion of a current language. It is determined during the SAPUI5 bootstrap from the following sources of information. 
		 * The sources are ordered increasingly by priority and the last available user language/locale wins:
		 * 1. Hard-coded SAPUI5 default locale en
		 * 2. Potentially configured browser language (window.navigator.browserLanguage); for Internet Explorer this is the language of the operating system
		 * 3. Potentially configured user language (window.navigator.userLanguage); for Internet Explorer this is the language in the region settings
		 * 4. General language information from the browser (window.navigator.language)
		 * 5. Android: Language contained in the user agent string (window.navigator.userAgent)
		 * 6. First language from the list of the user’s preferred languages (window.navigator.languages[0])
		 * 7. Locale configured in the application coding (see API Reference:  sap.ui.core.Configuration)
		 * 8. Locale configured via URL parameters sap-ui-language
		 */
		setupSpaceAndTime: function() {
			var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();

			moment.locale(sCurrentLocale);
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/** 
		 * Checks if the current navigatin is allowed based on the user model
		 */
		isUserLoggedIn: function(sUserName) {
			var oModel = this.getModel("user");

			if (!oModel || !oModel.getProperty("/" + this.S_USERLOGIN_PARAM_NAME) || oModel.getProperty("/" + this.S_USERLOGIN_PARAM_NAME) === "") {
				jQuery.sap.log.warning("User nicht angemeldet", "this.getModel(\"user\") undefined or property " + this.S_USERLOGIN_PARAM_NAME + " not given or empty.", this.toString());
				return false;
			}

			return true;
		},

		_getDefaultRoutePattern: function(sRouteName) {
			return this.getRouter().getRoute(sRouteName).getPattern();
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body)
					.hasClass("sapUiSizeCozy") || jQuery(document.body)
					.hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		hideBusyIndicator: function() {
			sap.ui.core.BusyIndicator.hide();
		},

		showBusyIndicator: function(iDelay) {
			iDelay = iDelay || 0;
			sap.ui.core.BusyIndicator.show(iDelay);
		},

	});

});