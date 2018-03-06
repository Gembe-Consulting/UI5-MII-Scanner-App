sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/mii/scanner/model/models",
	"com/mii/scanner/controller/ErrorHandler",
	"sap/m/MessageBox"
], function(UIComponent, Device, models, ErrorHandler, MessageBox) {
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

			this._bDebugMode = jQuery.sap.debug();

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);
			


			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.setupSpaceAndTime();

			this.setupScannerDetection();

			this.setupRouting();

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
		 * 
		 * see https://scotch.io/tutorials/javascript-promises-for-dummies
		 * 
		 */
		testUserLoginName: function(sUserInput) {
			var sUserInputUpper = sUserInput ? sUserInput.toUpperCase() : "",
				validateUserLoginName, 
				updateUserModel, 
				onLoginError;

			this.showBusyIndicator();

			validateUserLoginName = function(oLoginResult) {
				var oUser;

				try {
					oUser = oLoginResult.d.results[0].Rowset.results[0].Row.results[0];
				} catch (err) {
					jQuery.sap.log.error("Das Resultset enthält keine Benutzerdaten!", [err], ["Component.testUserLoginName"]);
					return Promise.reject(err);
				}

				if (oUser && oUser.USERLOGIN === sUserInputUpper) {
					return oUser;
				} else {
					return Promise.reject("Der zurückgegeben Username entspricht nicht der Benutzereingabe!", [], ["Component.testUserLoginName"]);
				}
			}.bind(this);

			updateUserModel = function(oUser) {
				this.getModel("user").setProperty("/", oUser);
			}.bind(this);

			onLoginError = function(oError) {
				this.resetUserModel({});
				this.hideBusyIndicator();
				throw oError; //re-throw to inform Login about error
			}.bind(this);

			return this.getUserLoginName(sUserInputUpper)
				.then( /*onFulfilled*/ validateUserLoginName)
				.then( /*onFulfilled*/ updateUserModel)
				.catch( /*onRejected*/ onLoginError)
				.then( /*onFulfilled*/ this.hideBusyIndicator);
		},

		/**
		 * @return a Promise containig user data {__metadata: {…}, USERLOGIN: string, USERNNAME: string || null, USERVNAME: string || null, RowId: int}
		 * It may, or may not contain the user data. Its on the caller to check this.
		 */
		getUserLoginName: function(sUserInput) {
			var oModel = this.getModel("user"),
				oParam = {
					"Param.1": sUserInput
				};

			return oModel.loadMiiData(oModel._sServiceUrl, oParam);
		},

		/** 
		 * Checks if the current navigatin is allowed based on the user model
		 */
		isUserLoggedIn: function() {
			var oModel = this.getModel("user");
			
			//always return true if we are in debug mode
			if(this._bDebugMode){
				oModel.setProperty("/USERLOGIN", "DEBUG-USER");
				return true;
			}

			if (!oModel || !oModel.getProperty("/USERLOGIN") || oModel.getProperty("/USERLOGIN") === "") {
				jQuery.sap.log.warning("User nicht angemeldet", "this.getModel('user') undefined or property USERLOGIN not given or empty.", this.toString());
				return false;
			}

			return true;
		},

		discoverIllumLoginName: function() {
			var oDiscoverdIllumLoginName,
				bMobile = this.getModel("device").getProperty("/browser/mobile"),
				sIllumLoginName;

			oDiscoverdIllumLoginName = new Promise(function(resolve, reject) {
				if (!bMobile) {
					sIllumLoginName = $("#IllumLoginName").val();
					if (!!sIllumLoginName) {
						resolve(sIllumLoginName);
						return;
					} else {
						reject(new Error("Could not read #IllumLoginName"));
						return;
					}
				}
				reject(new Error("This is a mobile device, we are not allowed to read #IllumLoginName"));
			});
			
			return oDiscoverdIllumLoginName;
		},

		resetUserModel: function(oObject) {
			var oEmpty = oObject || {};
			return this.getModel("user").setProperty("/", oEmpty);
		},

		forceRedirectToLoginPage: function(oError) {
			this.resetUserModel();
			this.getRouter().navTo("forbidden", {}, true /*bReplace*/ );
		},

		setupRouting: function() {
			// create the views based on the url/hash
			this.getRouter().initialize();

			// purge username from user modele, once login page is displayed
			this.getRouter().getTarget("login").attachDisplay(function(oEvent) {
				this.resetUserModel();
			}.bind(this));

			// set the browser page title based on navigation
			this.getRouter().attachTitleChanged(function(oEvent) {
				document.title = oEvent.getParameter("title");
			});
		},

		/**
		 * Adds an jQuery event listener to the html document
		 * Only if current system is not a desktop device!
		 */
		setupScannerDetection: function() {
			var bMobile= this.getModel("device").getProperty("/browser/mobile");
			if (bMobile) {

				jQuery(document).scannerDetection({
					onComplete: function(sString) {
						jQuery.sap.log.info("Input from Scanner: " + sString, "Event: onComplete", "ScannerDetection");
					},
					onError: function(sString) { // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
						//MessageBox.error("Das Lesen des Barcode entspricht icht den angegebenen Restriktionen.\nInhalt: \'" + sString + "\'", {
						//	title: "Fehler beim Einlesen des Barcodes"
						//});
						jQuery.sap.log.error("Scan war nicht erfolgreich: " + sString, "Event: onError", "ScannerDetection");
					},
					onReceive: function(event, a, b, c) { // Callback after receiving and processing a char (scanned char in parameter)
						jQuery.sap.log.info("Key stroke detected from Scanner: " + event.key + " (" + event.keyCode + ")", "Event: onReceive", "ScannerDetection");
					},
					onKeyDetect: function(event) { // Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
						jQuery.sap.log.debug("Key stroke detected: " + event.key + " (" + event.keyCode + ")", "Event: onKeyDetect", "ScannerDetection");
					},
					timeBeforeScanTest: 100, // Wait duration (ms) after keypress event to check if scanning is finished. default: 100
					avgTimeByChar: 30, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning. default : 30
					minLength: 4, // Minimum length for a scanning. default: 6
					endChar: [13], // Chars to remove and means end of scanning
					startChar: [], // Chars to remove and means start of scanning
					ignoreIfFocusOn: ".noScannerInput", // do not handle scans if the currently focused element matches this selector
					scanButtonKeyCode: false, // Key code of the scanner hardware button (if the scanner button a acts as a key itself) 
					scanButtonLongPressThreshold: 3, // How many times the hardware button should issue a pressed event before a barcode is read to detect a longpress
					onScanButtonLongPressed: false, // Callback after detection of a successfull scan while the scan button was pressed and held down
					stopPropagation: false, // Stop immediate propagation on keypress event
					preventDefault: false // Prevent default action on keypress event
				});
			}
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
		
		getDebugMode:function(){
			return this._bDebugMode === "true";
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

		hideBusyIndicator: function() {
			sap.ui.core.BusyIndicator.hide();
		},

		showBusyIndicator: function(iDelay) {
			iDelay = iDelay || 0;
			sap.ui.core.BusyIndicator.show(iDelay);
		},

		_getDefaultRoutePattern: function(sRouteName) {
			return this.getRouter().getRoute(sRouteName).getPattern();
		}
	});

});