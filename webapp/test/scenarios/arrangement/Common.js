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

		return Opa5.extend("com.mii.scanner.test.arrangement.Common", {

			constructor: function(oConfig) {
				Opa5.apply(this, arguments);

				this._oConfig = oConfig;
			},

			iStartTheApp: function(oOptions) {
				var sUrlParameters;
				oOptions = oOptions || {
					delay: 0,
					mobile: false,
					illumLoginName: ""
				};

				sUrlParameters = "serverDelay=" + oOptions.delay;

				if (oOptions.illumLoginName !== "") {
					sUrlParameters = sUrlParameters + "&IllumLoginName=" + oOptions.illumLoginName;
				}

				this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));
			},

			iNavigateToPage: function(sHash) {
				var oHashChanger = sap.ui.test.Opa5.getHashChanger();
				oHashChanger.setHash(sHash);
			}
		});
	});