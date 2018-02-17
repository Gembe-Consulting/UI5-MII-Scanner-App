sap.ui.require([
	"com/mii/scanner/test/integration/pages/Common",
	'sap/ui/test/Opa5',
	'sap/ui/test/matchers/Interactable',
	"sap/ui/test/matchers/Properties",
	'sap/ui/test/matchers/PropertyStrictEquals',
	'sap/ui/test/actions/Press',
	'sap/ui/test/actions/EnterText'
], function(Common, Opa5, Interactable, Properties, PropertyStrictEquals, Press, EnterText) {
	"use strict";
	var sLoginViewName = "Login",
		sHomepageViewName = "Home",
		sNavigation = "navListId",
		sUserIdInput = "usernameInput",
		sLoginButton = "loginButton";

	Opa5.createPageObjects({

		onTheApp: {
			baseClass: Common,
			actions: {
				iPressOnTheForwardButton: function() {
					return this.waitFor({
						success: function() {
							Opa5.getWindow().history.forward();
						}
					});
				},
				iPressOnTheBackButton: function() {
					return this.waitFor({
						success: function() {
							Opa5.getWindow().history.back();
						}
					});
				}
			},
			assertions: {
				shouldNavigateTo: function(sViewName) {
					return this.waitFor({
						viewName: sViewName,
						viewNamespace: "com.mii.scanner.view.nav.",
						success: function() {
							Opa5.assert.ok(true, "Navigation complete to: " + sViewName);
						},
						errorMessage: "Page " + sViewName + " not found."
					});
				}
			}
		},

		onTheLoginPage: {
			baseClass: Common,
			actions: {
				iPressOnLoginButton: function() {
					return this.waitFor({
						id: sLoginButton,
						viewName: sLoginViewName,
						actions: new Press(),
						errorMessage: "Could not trigger 'press' on login Button."
					});
				},
				iEnterUsername: function(sInput) {
					return this.waitFor({
						id: sUserIdInput,
						viewName: sLoginViewName,
						actions: new EnterText({
							text: sInput
						}),
						errorMessage: "Could not enter text to username Input."
					});
				}
			},
			assertions: {

				thePageShouldHaveLoginButton: function() {
					return this.waitFor({
						id: sLoginButton,
						viewName: sLoginViewName,
						matchers: new Interactable(),
						success: function(oButton) {
							Opa5.assert.ok(oButton.getVisible(), "Login Button available");
						},
						errorMessage: "Login Button is not available."
					});
				},

				thePageShouldHaveLoginInput: function() {
					return this.waitFor({
						id: sUserIdInput,
						viewName: sLoginViewName,
						matchers: new Interactable(),
						success: function(oInput) {
							Opa5.assert.ok(oInput.getVisible(), "Login Input field available");
						},
						errorMessage: "Login Input field is not available."
					});
				},

				theAppShouldNotNavigateAndStayOnLoginPage: function() {
					return this.waitFor({
						id: "loginPage",
						viewName: sLoginViewName,
						success: function(oLoginPage) {
							Opa5.assert.strictEqual(oLoginPage.getTitle(), "Scanner Anmeldung", "Page did not navigate away from Login Page: " + oLoginPage.getTitle());
						},
						errorMessage: "Navigation away from Login Page occured."
					});
				},

				theInputFieldShouldContainUsername: function(sExpectedValue) {
					return this.waitFor({
						id: sUserIdInput,
						viewName: sLoginViewName,
						matchers: new PropertyStrictEquals({
							name: "value",
							value: sExpectedValue
						}),
						success: function(oInput) {
							Opa5.assert.strictEqual(oInput.getValue(), sExpectedValue, "Input field contains user name: " + sExpectedValue);
						},
						errorMessage: "Userfield does not contain correct username: " + sExpectedValue
					});
				},

				theAppShouldShowLoginError: function() {
					return this.waitFor({
						id: sUserIdInput,
						viewName: sLoginViewName,
						matchers: new PropertyStrictEquals({
							name: "valueState",
							value: "Error"
						}),
						success: function(oInput) {
							Opa5.assert.strictEqual(oInput.getValueState(), "Error", "Input field shows error state");
							Opa5.assert.ok(oInput.getValueStateText().length > 0, "Input field shows error message: " + oInput.getValueStateText());
						},
						errorMessage: "No error shown."
					});
				}
			}
		},

		onHomePage: {
			baseClass: Common,
			actions: {
				iPressTheNavigatenItem: function(sNavItemId) {
					return this.waitFor({
						id: sNavItemId,
						viewName: sHomepageViewName,
						viewNamespace: "com.mii.scanner.view.nav.",
						matchers: new Properties({
							type: "Navigation"
						}),
						controlType: "sap.m.CustomListItem",
						actions: new Press(),
						success: function(oListItem) {
							Opa5.assert.ok(true, "Triggerted Navigation by pressing " + sNavItemId);
						},
						errorMessage: "Navigation Item was not found."
					});
				},
				iPressTheLogoutItem: function(sNavItemId) {
					return this.waitFor({
						id: sNavItemId,
						viewName: sHomepageViewName,
						viewNamespace: "com.mii.scanner.view.nav.",
						matchers: new Properties({
							type: "Active"
						}),
						controlType: "sap.m.CustomListItem",
						actions: new Press(),
						success: function(oListItem) {
							Opa5.assert.ok(true, "Triggerted Logout by pressing " + sNavItemId);
						},
						errorMessage: "Logout Item was not found."
					});
				}
			},
			assertions: {
				theAppShouldNavigateToHomePage: function() {
					return this.waitFor({
						id: "homePage",
						viewName: sHomepageViewName,
						viewNamespace: "com.mii.scanner.view.nav.",
						success: function(oHomePage) {
							Opa5.assert.strictEqual(oHomePage.getTitle(), "Startseite Scanner", "Navigation to Homepage complete to: " + oHomePage.getTitle());
						},
						errorMessage: "Navigation to Homepage did not happen."
					});
				},

				theFooterShouldShowUsername: function(sExpectedValue) {
					return this.waitFor({
						controlType: "sap.m.Text",
						viewName: sHomepageViewName,
						viewNamespace: "com.mii.scanner.view.nav.",
						matchers: new Properties({
							text: new RegExp(sExpectedValue, "i")
						}),
						success: function() {
							Opa5.assert.ok(true, "Page footer contains user name: " + sExpectedValue);
						},
						errorMessage: "Page footer does not contain username: " + sExpectedValue
					});
				}
			}
		},
		onGoodMovementNavigationPage: {
			baseClass: Common,
			actions: {
				iPressTheBackButton: function() {
					return this.waitFor({
						id: "goodsMovementPage",
						viewName: "GoodsMovement",
						viewNamespace: "com.mii.scanner.view.nav.",
						actions: new Press(),
						errorMessage: "Did not find the back nav button on page"
					});
				}
			},
			assertions: {

			}
		},
		onStatusChangeNavigationPage: {
			baseClass: Common,
			actions: {
				iPressTheBackButton: function() {
					return this.waitFor({
						id: "statusChangePage",
						viewName: "StatusChange",
						viewNamespace: "com.mii.scanner.view.nav.",
						actions: new Press(),
						errorMessage: "Did not find the back nav button on page"
					});
				}
			},
			assertions: {

			}
		}
	});
});