sap.ui.require(["sap/ui/test/opaQunit"], function(opaTest) {
	"use strict";

	/*
	 * The three objects Given, When, Then are filled by the OPA runtime when the test is executed and contain the arrangements, actions, and assertions for the test. 
	 * The "Given-When-Then" pattern is a common style for writing tests in a readable format. To describe a test case, you basically write a user story. 
	 * Test cases in this format are easy to understand, even by non-technical people.
	 */

	QUnit.module("Login on desktop device");

	opaTest("Should show login screen on empty navigation", function(Given, When, Then) {
		// Arrangements
		// -Define possible initial states, e.g. the app is started, or specific data exists. 
		// -For performance reasons, starting the app is usually done only in the first test case of a journey.
		Given.iStartTheApp().and.iUseDevice("desktop");

		// Actions
		// -Define possible events triggered by a user, e.g. entering some text, clicking a button, navigating to another page.
		When.onTheLoginPage.iLookAtTheScreen();

		// Assertions
		// -Define possible verifications, e.g. do we have the correct amount of items displayed, does a label display the right data, is a list filled. 
		// -At the end of the test case, the app is destroyed again. This is typically done only once in the last test case of the journey for performance reasons.
		Then.onTheLoginPage.thePageShouldHaveLoginInput().and.thePageShouldHaveLoginButton().and.theAppShouldNotNavigateAndStayOnLoginPage();
	});

	opaTest("Should prevent navigation on empty username", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onTheLoginPage.iPressOnLoginButton();

		// Assertions
		Then.onTheLoginPage.theAppShouldNotNavigateAndStayOnLoginPage();
	});

	opaTest("Should allow keyboard input on desktop devices", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onTheLoginPage.iEnterUsername("foobar");

		// Assertions
		Then.onTheLoginPage.theInputFieldShouldContainUsername("foobar");
	});

	opaTest("Should prevent navigation to homepage on wrong username", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onTheLoginPage.iPressOnLoginButton();

		// Assertions
		Then.onTheLoginPage.theAppShouldShowLoginError().
		and.theInputFieldShouldContainUsername("foobar").
		and.theAppShouldNotNavigateAndStayOnLoginPage();
	});

	opaTest("Should navigate to homepage on correct username", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onTheLoginPage.iEnterUsername("pHigEm").and.iPressOnLoginButton();

		// Assertions
		Then.onHomePage.theAppShouldNavigateToHomePage();
	});

	opaTest("Should show username in footer", function(Given, When, Then) {
		// Arrangements
		// Actions
		// Assertions
		Then.onHomePage.theFooterShouldShowUsername("phigem");
	});

});