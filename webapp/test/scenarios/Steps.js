sap.ui.define([
	"jquery.sap.global",
	"openui5genericapptesting/GenericSteps", // openui5genericapptesting is mapped via sap-ui-resourceroots
	"sap/ui/test/gherkin/StepDefinitions",
	"sap/ui/test/Opa5"
], function($, oGenericSteps, StepDefinitions, Opa5) {

	return StepDefinitions.extend("com/mii/scanner/test/Steps", {
		init: function() {
			var opa = new Opa5();

			this.register(/^I can see (.*?) has focus in (.*?) view$/i,
				function(sControlId, sViewName, Given, When, Then) {
					Then.iCanSeeControlHasFocus(sControlId, sViewName);
				}
			);

			this.register(/^the url parameter "(.*?)" is removed$/i,
				function(sUrlParameter, Given, When, Then) {
					Then.theUrlShouldNotContainParameter(sUrlParameter);
				}
			);

			this.register(/^the url parameter "(.*?)" exists/i,
				function(sUrlParameter, Given, When, Then) {
					Then.theUrlShouldContainParameter(sUrlParameter);
				}
			);

			this.register(/^I navigate to "(.*?)"/i,
				function(sHash, Given, When, Then) {
					Given.iNavigateToPage(sHash);
				}
			);

			this.register(/^I start the app on "(.*?)" using remote user "(.*?)"$/i,
				function(sHash, sUsername, Given, When, Then) {
					Given.iStartTheApp({
						hash: sHash,
						illumLoginName: sUsername
					});
				}
			);

			this.register(/^I start the app on '(.*?)' using parameter '(.*?)'$/i,
				function(sHash, sParameter, Given, When, Then) {

					Given.iStartTheApp({
						hash: sHash
					});
				}
			);

			this.register(/^I start the app on '(.*?)' with '(.*?)' (error|type) '(.*?)'$/i,
				function(sHash, sService, sTextOrType, sError, Given, When, Then) {

					var bFatalError = sTextOrType.indexOf("type") === -1;

					Given.iStartTheApp({
						hash: sHash,
						errorServiceName: sService,
						errorServiceMessage: bFatalError ? sError : "",
						errorServiceType: bFatalError ? "fatalError" : sError
					});
				}
			);

			this.register(/^I can see the service error with title '(.*?)' and message '(.*?)'$/i,
				function(sErrorTitle, sErrorMessage, Given, When, Then) {
					Given.iShouldSeeThServiceErrorMessageBox(sErrorTitle, sErrorMessage);
				}
			);

			this.register(/^I close all service error message boxes$/i,
				function(Given, When, Then) {
					Given.iCloseTheMessageBox();
				}
			);

			//Then I should see goodsReceiptPageTitle in action.GoodsReceipt view has color '#1F35DE'
			//this.register(/^I start the app on '(.*?)' using parameter '(.*?)'"$/i,
			this.register(/^I can see (.+?) in (.+?) view has css (.+?) '(.+?)'$/i,
				function(sControlId, sViewName, sCssProperty, sValue, Given, When, Then) {
					Then.iCanSeeControlHasCSSProperty({
						sControlId: sControlId,
						sViewName: sViewName,
						sCssProperty: sCssProperty,
						sValue: sValue
					});
				}
			);

			//I can see (.*?) has focus in (.*?) view$/i
			//this.register(/^I can see (.+?) in (.+?) view has css (.+?) '(.+?)'$/i,
			this.register(/^I can enter a date (\d+) (.+) and (\d+) (.+) in the (future|past) into (.+) in (.+) view$/i,
				function(iOffset, sUnit, iTimeOffset, sTimeUnit, sDirection, sControlId, sViewName, Given, When, Then) {
					When.iCanEnterRelativeDate({
						offset: iOffset,
						unit: sUnit,
						timeOffset: iTimeOffset,
						timeUnit: sTimeUnit,
						direction: sDirection,
						controlId: sControlId,
						viewName: sViewName
					});
				}
			);

			//this.register(/^I enter a date\s(\d)\s(.+?)\sand\s(\d)\s(.+?)\sin\sthe\s(future|past)\sinto\s(.+?)\sin\s(.+?)$/i,
			this.register(/^I should see (.+) with date (\d+) (.+) and (\d+) (.+) in the (future|past) in (.+) view$/i,
				function(sControlId, iOffset, sUnit, iTimeOffset, sTimeUnit, sDirection, sViewName, Given, When, Then) {
					Then.iSouldSeeRelativeDate({
						offset: iOffset,
						unit: sUnit,
						timeOffset: iTimeOffset,
						timeUnit: sTimeUnit,
						direction: sDirection,
						controlId: sControlId,
						viewName: sViewName
					});
				}
			);

			oGenericSteps.register(
				this, /* GherkinSteps */
				opa, /* oOpaInstance */
				Opa5 /* Opa5 */
			);

		}
	});
});