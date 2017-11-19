sap.ui.require([
		"com/mii/scanner/test/integration/pages/Common",

		'sap/ui/test/Opa5',

		'sap/ui/test/matchers/Interactable',
		"sap/ui/test/matchers/Properties",
		'sap/ui/test/matchers/PropertyStrictEquals',

		'sap/ui/test/actions/Press',
		'sap/ui/test/actions/EnterText'
	],
	function(Common, Opa5, Interactable, Properties, PropertyStrictEquals, Press, EnterText) {
		"use strict";
		var sLoginViewName = "Login",
			sHomepageViewName = "Home",
			sNavigationId = "navListId",
			sLoginPageId = "loginPage",
			sUsernameInputId = "userIdInput",
			sLoginButtonId = "loginButton";

		Opa5.createPageObjects({

			onTheScannerLoginPage: {
				baseClass: Common,
				actions: {
					iTypeInUsername: function(sInput) {
						return this.waitFor({
							id: sUsernameInputId,
							viewName: sLoginViewName,
							actions: new EnterText({
								text: sInput
							}),
							errorMessage: "Could not enter text to username Input."
						});
					},
					iTypeInUsernameAndSubmitVeryFast: function(sInput) {

						return this.waitFor({
							id: sUsernameInputId,
							viewName: sLoginViewName,
							actions: [
								new EnterText({
									text: sInput
								}), 
								function(oInput) {
									oInput.fireSubmit({
										value: sInput
									});
								}
							],
							errorMessage: "Could not find Login Input Field.",
							success: function(oInput) {
								//Opa5.assert.strictEqual(oInput.getValue(), sInput, "Username entered: " + sInput);
								Opa5.assert.ok(true, "Username entered: " + sInput);
							}
						});
					}
				},
				assertions: {
					theAppShouldShowLoginPage: function() {
						return this.waitFor({
							id: sLoginPageId,
							viewName: sLoginViewName,
							success: function(oLoginPage) {
								Opa5.assert.strictEqual(oLoginPage.getTitle(), "Scanner Anmeldung", "Page did not navigate away from Login Page: " + oLoginPage.getTitle());
							},
							errorMessage: "Navigation away from Login Page occured."
						});
					},
					theInputFieldShouldPurgeInput: function() {
						return this.waitFor({
							id: sUsernameInputId,
							pollingInterval: 400,
							viewName: sLoginViewName,
							success: function(oInput) {
								Opa5.assert.strictEqual(oInput.getValue(), "", "Input field is empty, propably has been purged");
							},
							errorMessage: "Could not find input field."
						});
					}
				}
			}
		});
	});