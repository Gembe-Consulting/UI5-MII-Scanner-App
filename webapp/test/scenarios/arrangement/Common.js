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

				if (oOptions.errorServiceName) {
					sUrlParameters = sUrlParameters + "&" + "errorServiceName=" + oOptions.errorServiceName;
				}
				if (oOptions.errorServiceMessage) {
					sUrlParameters = sUrlParameters + "&" + "errorServiceMessage=" + oOptions.errorServiceMessage;
				}
				if (oOptions.errorServiceType) {
					sUrlParameters = sUrlParameters + "&" + "errorServiceType=" + oOptions.errorServiceType;
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

			iShouldSeeThServiceErrorMessageBox: function(sErrorTitle, sErrorMessage) {
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Dialog",
					matchers: new PropertyStrictEquals({
						name: "title",
						value: sErrorTitle
					}),
					success: function(oMessageBox) {
						var oMsg;

						Opa5.assert.strictEqual(oMessageBox.length, 1, "One Error Message Box is found matching title");

						oMsg = oMessageBox[0];

						Opa5.assert.strictEqual(oMsg.getTitle(), sErrorTitle, "Error Message Box has title: " + sErrorTitle);
						Opa5.assert.strictEqual(oMsg._$content.text(), sErrorMessage, "Error Message Box has text: " + sErrorMessage);
					},
					actions: new Press(),
					errorMessage: "Did not find the Error Message Box"

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

			iCloseTheMessageBox: function(sButtonText) {
				var oButtonToPress = null,
					sButtonText = sButtonText || "Schließen";

				this.waitFor({
					searchOpenDialogs: true,
					viewName: "sap.m.MessageBox",
					controlType: "sap.m.Button",
					check: function(aButtons) {
						return aButtons.filter(function(oButton) {
							if (oButton.getText() !== sButtonText) {
								return false;
							}

							oButtonToPress = oButton;
							return true;
						});
					},
					success: function(oMessageBox) {
						Opa5.assert.ok(true, "Message Box has been found");
					},
					errorMessage: "Did not find the Message Box"
				});

				return this.waitFor({
					searchOpenDialogs: true,
					viewName: "sap.m.MessageBox",
					controlType: "sap.m.Button",
					matchers: new PropertyStrictEquals({
						name: "text",
						value: sButtonText
					}),
					check: function(aButtons) {
						//now you can compare oControl with aControlsFromThisWaitFor
						//or you can compare sap.ui.test.Opa.getContext().control with aControlsFromThisWaitFor
						return aButtons.filter(function(oButton) {
							if (oButton.getId() !== oButtonToPress.getId()) {
								return false;
							}
							return true;
						});
					},
					actions: new Press(),
					success: function(oButton) {
						Opa5.assert.ok(true, "Button to close the Message Box has been pressed");
					},
					errorMessage: "Did not find the Message Box"
				});
			}
		});
	});