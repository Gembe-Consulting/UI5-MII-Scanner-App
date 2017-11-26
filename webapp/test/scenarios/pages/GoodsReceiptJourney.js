sap.ui.require(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		/*
		 * The three objects Given, When, Then are filled by the OPA runtime when the test is executed and contain the arrangements, actions, and assertions for the test. 
		 * The "Given-When-Then" pattern is a common style for writing tests in a readable format. To describe a test case, you basically write a user story. 
		 * Test cases in this format are easy to understand, even by non-technical people.
		 */

		QUnit.module("Create Goods Receipt");

		opaTest("Should navigate to Goods Receipt Page", function(Given, When, Then) {
			// Arrangements
			Given.iStartTheApp({
				illumLoginName:"PHIGEM",
				hash: "/Start/Warenbewegung/WE"
			});

			// Actions
			When.iLookAtTheScreen();

			// Assertions
			Then.onTheGoodsReceiptPage.iCanSeeTheBackButton().
				and.iCanSeeTheSaveButton().
				and.iCanSeeTheCancelButton().
				and.iCanSeeTheStorageUnitNumberInput().
				and.iCanSeeTheOrderNumberInput().
				and.iCanSeeTheQuantityInput().
				and.iCanSeeTheUnitOfMeasureLabel().
				and.iCanSeeTheStorageLocationInput();
		});
	}
);