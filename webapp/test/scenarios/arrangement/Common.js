sap.ui.define([
		'sap/ui/test/Opa5',
		'sap/ui/qunit/QUnitUtils'
	],
	function(Opa5, QUnitUtils) {
		"use strict";

		function getFrameUrl(sHash, sUrlParameters) {
			sHash = sHash || "";
			var sUrl = jQuery.sap.getResourcePath("com/mii/scanner/app/mockServer", ".html");

			if (sUrlParameters) {
				sUrlParameters = "?" + sUrlParameters;
			}

			return sUrl + sUrlParameters + "#" + sHash;
		}

		return Opa5.extend("com.mii.scanner.test.arrangement.Common", {

			constructor: function(oConfig) {
				Opa5.apply(this, arguments);

				this._oConfig = oConfig;

				this.oQUnitUtils = QUnitUtils;
			},

			iStartTheApp: function(oOptions) {
				var sUrlParameters;
				oOptions = oOptions || {
					delay: 0
				};

				sUrlParameters = "serverDelay=" + oOptions.delay;

				if (oOptions.errorType) {
					sUrlParameters = sUrlParameters + "&" + "errorType=" + oOptions.errorType
				}

				if (oOptions.errorService) {
					sUrlParameters = sUrlParameters + "&" + "errorService=" + oOptions.errorService
				}

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