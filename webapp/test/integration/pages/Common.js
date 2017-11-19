sap.ui.define([
		'sap/ui/test/Opa5'
	],
	function(Opa5) {
		"use strict";

		function getFrameUrl(sHash, sUrlParameters) {
			sHash = sHash || "";
			var sUrl = jQuery.sap.getResourcePath("com/mii/scanner/app", ".html");

			if (sUrlParameters) {
				sUrlParameters = "?" + sUrlParameters;
			}

			return sUrl + sUrlParameters + "#" + sHash;
		}

		return Opa5.extend("com.mii.scanner.test.integration.pages.Common", {

			constructor: function(oConfig) {
				Opa5.apply(this, arguments);

				this._oConfig = oConfig;
			},

			iStartApp: function(oOptions) {
				var sUrlParameters;
				oOptions = oOptions || {
					delay: 0
				};

				sUrlParameters = "serverDelay=" + oOptions.delay;

				this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));
			},

			iLookAtTheScreen: function() {
				return this;
			}

		});
	});