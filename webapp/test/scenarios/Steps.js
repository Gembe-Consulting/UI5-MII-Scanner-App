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
			
			//Then I should see goodsReceiptPageTitle in action.GoodsReceipt view has color '#1F35DE'
			//this.register(/^I start the app on '(.*?)' using parameter '(.*?)'"$/i,
			this.register(/^I can see (.+?) in (.+?) view has css (.+?) '(.+?)'$/i,
				function(sControlId, sViewName, sCssProperty, sValue, Given, When, Then) {
					Then.iCanSeeControlHasColor({
						sControlId: sControlId,
						sViewName:sViewName,
						sCssProperty:sCssProperty,
						sValue:sValue
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