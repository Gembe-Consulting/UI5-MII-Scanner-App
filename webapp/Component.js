//jQuery.sap.registerModulePath("mii.util", "../ui5miiutilities/mii/util/");
sap.ui.define([
	"jquery.sap.global",
	"com/mii/scanner/libs/momentjs/moment",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/Device",
	"com/mii/scanner/model/models",
	"com/mii/scanner/controller/helper/ErrorHandler",
	"com/mii/scanner/controller/helper/UserHandler"
], function(jQuery, momentjs, UIComponent, MessageBox, Device, models, ErrorHandler, UserHandler) {
	"use strict";
	/* global moment:true */

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

			// initialize the user handler with the component
			this._oUserHandler = new UserHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.setupRouting(this.getRouter());
			
			this.setupSpaceAndTime();

			this.setupScannerDetection();

			this.evaluateExternalCallingComponent();
		},

		getUserHandler: function() {
			return this._oUserHandler;
		},

		setupRouting: function(oRouter) {
			var fnResetUserModel, fnChangeTitle;
			
			// create the views based on the url/hash
			oRouter.initialize();
			
			fnResetUserModel = function (oEvent) {
				this._oUserHandler.resetUserModel();
			};
			
			fnChangeTitle = function (oEvent) {
				document.title = oEvent.getParameter("title");
			};

			// purge username from user modele, once login page is displayed
			oRouter.getTarget("login").attachDisplay(jQuery.proxy(fnResetUserModel, this));

			// set the browser page title based on navigation
			oRouter.attachTitleChanged(fnChangeTitle);
		},

		evaluateExternalCallingComponent: function() {
			var sExternalHash = this._setHashFromLocalStorage();

			if (sExternalHash) {
				this._setModelFromLocalStorage();
			}

		},

		_setModelFromLocalStorage: function() {
			this._externalCaller = true;
		},

		_setHashFromLocalStorage: function() {
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
				sHash = oStorage.get("HASH");

			if (sHash) {
				this.getRouter().parse(sHash);
			}

			return sHash;
		},

		/**
		 * Adds an jQuery event listener to the html document
		 * Only if current system is not a desktop device!
		 */
		setupScannerDetection: function() {
			var bIsDesktopDevice = this.getModel("device").getProperty("/system/desktop"),
				iEnterKey = 13;

			if (!bIsDesktopDevice) {

				jQuery(document).scannerDetection({
					onComplete: function(sString) {
						jQuery.sap.log.info("Input from Scanner: " + sString, "Event: onComplete", "ScannerDetection");
					},
					onError: function(sString) { // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
						jQuery.sap.log.error("Scan war nicht erfolgreich: " + sString, "Event: onError", "ScannerDetection");
					},
					onReceive: function(oEvent) { // Callback after receiving and processing a char (scanned char in parameter)
						jQuery.sap.log.debug("Key stroke detected from Scanner: " + oEvent.key + " (" + oEvent.keyCode + ")", "Event: onReceive", "ScannerDetection");
					},
					onKeyDetect: function(oEvent) { // Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
						jQuery.sap.log.debug("Key stroke detected: " + oEvent.key + " (" + oEvent.keyCode + ")", "Event: onKeyDetect", "ScannerDetection");
					},
					timeBeforeScanTest: 100, // Wait duration (ms) after keypress event to check if scanning is finished. default: 100
					avgTimeByChar: 30, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning. default : 30
					minLength: 4, // Minimum length for a scanning. default: 6
					endChar: [iEnterKey], // Chars to remove and means end of scanning
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
			if (typeof this._sContentDensityClass === "undefined") {
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

		getDebugMode: function() {
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
			var iDefaultDelay = 0;
			iDelay = iDelay || iDefaultDelay;
			sap.ui.core.BusyIndicator.show(iDelay);
		}
	});

});