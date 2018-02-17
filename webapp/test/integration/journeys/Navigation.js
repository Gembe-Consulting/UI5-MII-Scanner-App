sap.ui.require(["sap/ui/test/opaQunit"], function(opaTest) {
	"use strict";

	QUnit.module("Navigation");

	opaTest("Should navigate to a deep page, while having a valid user model", function(Given, When, Then) {
		// Arrangements
		//Given.iTeardownMyApp();
		Given.iEnterNewHashToAnotherPage("/Start").and.iUseDevice("desktop");
		// Actions
		When.onTheLoginPage.iEnterNewHashToAnotherPage("/WE");
		// Assertions
		Then.onGoodsReceiptPage.theAppShouldNavigateToGoodsReceiptPage();
	});

	opaTest("Should navigate back to homepage from Goods Movement Page", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onGoodsReceiptPage.iPressTheCancelButton();

		// Assertions
		Then.onHomePage.theAppShouldNavigateToHomePage();
	});

	opaTest("Should navigate to a child page", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onHomePage.iPressTheNavigatenItem("navGoodsMovementItem");
		// Assertions
		Then.onTheApp.shouldNavigateTo("GoodsMovement");
	});

	opaTest("Should navigate back to Home Page using Browser back", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onTheApp.iPressOnTheBackButton();
		// Assertions
		Then.onTheApp.shouldNavigateTo("Home");
	});

	opaTest("Should navigate to another child page", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onHomePage.iPressTheNavigatenItem("navStatusChangeItem");
		// Assertions
		Then.onTheApp.shouldNavigateTo("StatusChange");
	});

	opaTest("Should navigate back to Home Page using Browser back", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onTheApp.iPressOnTheBackButton();
		// Assertions
		Then.onTheApp.shouldNavigateTo("Home");
	});

	opaTest("Should navigate forward to previous Page using Browser forward", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onTheApp.iPressOnTheForwardButton();
		// Assertions
		Then.onTheApp.shouldNavigateTo("StatusChange");
	});

	opaTest("Should navigate back to homepage from Status Change Page", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onStatusChangeNavigationPage.iPressTheBackButton();

		// Assertions
		Then.onTheApp.shouldNavigateTo("Home");
	});

	opaTest("Should navigate to login screen on logout", function(Given, When, Then) {
		// Arrangements
		// Actions
		When.onHomePage.iPressTheLogoutItem("navLogoutItem");

		// Assertions
		Then.onTheLoginPage.theAppShouldNotNavigateAndStayOnLoginPage();
	});
});