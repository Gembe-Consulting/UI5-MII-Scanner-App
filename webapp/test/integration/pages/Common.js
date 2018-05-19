sap.ui.define([
		"sap/ui/test/Opa5"
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

			iStartTheApp: function(oOptions) {
				var sUrlParameters;
				oOptions = oOptions || {
					delay: 0,
					mobile: false
				};
				
				sUrlParameters = "serverDelay=" + oOptions.delay;
				
				if(oOptions.mobile){
					sUrlParameters = sUrlParameters + "&xx-fakeOS=android&xx-test-mobile=true";
				}

				

				this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));

				return this;
			},

			iLookAtTheScreen: function() {
				return this;
			},

			iUseDevice: function(sDevice) {
				var bMobile = (sDevice === "mobile" ? true : false);

				return this.waitFor({
					check: function() {
						return this.hasAppStarted();
					},
					success: function() {
						sap.ui.test.Opa5.getWindow().sap.ui.Device.system.desktop = !bMobile;
						sap.ui.test.Opa5.getWindow().sap.ui.Device.system.phone = bMobile;
						sap.ui.test.Opa5.getWindow().sap.ui.Device._update(bMobile);
					},
					autoWait: true,
					errorMessage: "Could not wait for the application to be loaded"
				});
			},
			
			iEnterNewHashToAnotherPage: function(sHash) {
				return this.waitFor({
					success: function() {
						Opa5.getHashChanger().setHash(sHash);
					}
				});
			},
			
			theAppShouldNavigateToForbiddenPage:function(){
				
			}

		});
	});