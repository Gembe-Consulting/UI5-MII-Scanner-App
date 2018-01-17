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
		regexp: /^I hit '(.+?)' into ([a-zA-Z0-9]+)( in ([a-zA-Z0-9\.]+) view)?$/,
		action: function(sKey, sControlId, sViewPart, sViewName) {
			var that = this;
			var oWaitForOptions = {
				id: sControlId,
				success: function (oControl) {
                	var oWindow,
                		ojQuery,
                		sQueryKeyCode;
                		
                	oWindow = sap.ui.test.Opa5.getWindow();
                	ojQuery = sap.ui.test.Opa5.getJQuery();
                	
                	var $ActionDomRef = oWindow.$(oControl),
						oActionDomRef = $ActionDomRef[0];
                		
                		var oUtils =  oControl.getUtils();
                		
				oUtils.triggerKeydown(oActionDomRef, $.sap.KeyCodes[sKey]);
				oUtils.triggerKeyup(oActionDomRef, $.sap.KeyCodes[sKey]);
				
 /*               	
                	if(sKey){
                		sQueryKeyCode = jQuery.sap.KeyCodes[sKey];
                		if(sQueryKeyCode){
                			oWindow = sap.ui.test.Opa5.getWindow();
                			ojQuery = sap.ui.test.Opa5.getJQuery();
                			
                			ojQuery.event.trigger({ type : 'keypress', which : sQueryKeyCode });
                			
                			var e = ojQuery.Event("keypress");
							e.which = sQueryKeyCode; // # Some key code value
							//$("input").trigger(e);
							ojQuery(document).trigger(e);
                		}
                	}
  */             	
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