sap.ui.define([
	"jquery.sap.global",
	"com/mii/scanner/test/utils/genericSteps/GenericSteps", // ui5app.utils mapped via sap-ui-resourceroots
	"sap/ui/test/gherkin/StepDefinitions",
	"sap/ui/test/Opa5",
], function($, oGenericSteps, StepDefinitions, Opa5) {

	return StepDefinitions.extend("com/mii/scanner/test/Steps", {
		init: function() {
			var opa = new Opa5();
			
			this.register(/^the url parameter "(.*?)" is removed$/i,
				function(sUrlParameter, Given, When, Then) {
					Given.urlParameterDoesNotExist(sUrlParameter);
				}
			);
			
			this.register(/^the url parameter "(.*?)" exists/i,
				function(sUrlParameter, Given, When, Then) {
					Given.urlParameterExists(sUrlParameter);
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