sap.ui.define([
	"jquery.sap.global",
	"com/mii/scanner/test/utils/genericSteps/GenericSteps", // ui5app.utils mapped via sap-ui-resourceroots
	"sap/ui/test/gherkin/StepDefinitions",
	"sap/ui/test/Opa5",
], function($, oGenericSteps, StepDefinitions, Opa5) {

	return StepDefinitions.extend("com/mii/scanner/test/Steps", {
		init: function() {
			var opa = new Opa5();
			
			this.register(/^I do something more "(.*?)"$/i,
				function(sUsername, Given, When, Then) {
					Then.onDummyPage.iShallPass(sUsername);
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
			
			oGenericSteps.register(
				this, /* GherkinSteps */
				opa, /* oOpaInstance */
				Opa5 /* Opa5 */
			);


		}
	});
});