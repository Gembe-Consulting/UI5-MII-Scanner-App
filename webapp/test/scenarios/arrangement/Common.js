sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/ui/qunit/QUnitUtils",
		"sap/ui/test/matchers/Interactable",
		"sap/ui/test/matchers/Properties",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"sap/ui/test/matchers/Ancestor",
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText"
	],
	function(Opa5, QUnitUtils, Interactable, Properties, PropertyStrictEquals, Ancestor, Press, EnterText) {
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
					sUrlParameters = sUrlParameters + "&" + "errorType=" + oOptions.errorType;
				}

				if (oOptions.errorService) {
					sUrlParameters = sUrlParameters + "&" + "errorService=" + oOptions.errorService;
				}

				if (oOptions.illumLoginName !== "") {
					sUrlParameters = sUrlParameters + "&IllumLoginName=" + oOptions.illumLoginName;
				}

				this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));
				
				return this;
			},
			
			iNavigateToPage: function(sHash) {
				var oHashChanger = sap.ui.test.Opa5.getHashChanger();
				oHashChanger.setHash(sHash);
				
				return this;
			},

			//You can have some utility functionality for all Page Objects deriving from it

			iShouldSeeTheSaveButton: function(sViewName, bEnabledState) {
				return this.waitFor({
					id: "saveButton",
					visible: false,
					controlType: "sap.m.Button",
					viewName: sViewName,
					matchers: new PropertyStrictEquals({
						name: "enabled",
						value: bEnabledState
					}),
					success: function(oButton) {
						Opa5.assert.ok(oButton.getVisible(), "The save button is visible");
						Opa5.assert.strictEqual(oButton.getEnabled(), bEnabledState, "The save button property enabled is " + bEnabledState);
					},
					errorMessage: "Did not find the saveButton"
				});
			},

			iShouldSeeTheErrorMessageBox: function(sErrorMessage) {
				return this.waitFor({
					searchOpenDialogs: true,
					viewName: "sap.m.MessageBox",
					check: function(oMessageBox) {
						return !!sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").length && sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").find(".sapMMsgBoxText").text() === sErrorMessage;
					},
					success: function(oMessageBox) {
						Opa5.assert.ok(true, "Error Message Box is shown");
						Opa5.assert.ok(true, "Error Message Box has text: " + sErrorMessage);
					},
					errorMessage: "Did not find the Error Message Box"

				});
			},

			iCloseTheMessageBox: function() {
				return this.waitFor({
					searchOpenDialogs: true,
					viewName: "sap.m.MessageBox",
					actions: new Press(),
					success: function(oMessageBox) {
						Opa5.assert.ok(true, "Message Box has been closed");
					},
					errorMessage: "Did not find the Message Box"
				});
			}
		});
	});