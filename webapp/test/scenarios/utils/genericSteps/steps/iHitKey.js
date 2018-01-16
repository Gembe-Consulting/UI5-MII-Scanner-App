/*! openui5-generic-app-testing 2017-11-22 */

(function() {
	var module = {};
	module.exports = {
		docs: {
			description: "Fire a key press",
			synopsis: "I hit '<key>' [in <viewName> view]",
			examples: ["I hit 'ENTER'", "I hit 'F1' in Creation view"]
		},
		icon: "edit",
		regexp: /^I hit '(.+?)'( in ([a-zA-Z0-9\.]+) view)?$/,
		action: function(sKeyName, sViewPart, sViewName) {
			var that = this;
			var oWaitForOptions = {
				success: function () {
                	var oWindow,
                		ojQuery,
                		sQueryKeyCode;
                	
                	if(sKeyName){
                		sQueryKeyCode = jQuery.sap.KeyCodes[sKeyName];
                		if(sQueryKeyCode){
                			oWindow = sap.ui.test.Opa5.getWindow();
                			ojQuery = sap.ui.test.Opa5.getJQuery();
                			
                			ojQuery.event.trigger({ type : 'keypress', which : sQueryKeyCode });
                		}
                	}
                	
        		}
			};
			if (sViewPart) {
				oWaitForOptions.viewName = sViewName;
			}
			this.opa.waitFor(oWaitForOptions);
		}
	};
	module.exports.name = "iHitKey";
	sap.ui.define([], function() {
		return module.exports;
	});
})();