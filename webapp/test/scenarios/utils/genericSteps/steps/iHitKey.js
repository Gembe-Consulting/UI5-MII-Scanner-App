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
				success: function(oControl) {
					var oWindow,
						ojQuery,
						sQueryKeyCode;

					oWindow = sap.ui.test.Opa5.getWindow();
					ojQuery = sap.ui.test.Opa5.getJQuery();

					var $ActionDomRef = oWindow.$(oControl),
						oActionDomRef = $ActionDomRef[0];

					var oUtils = sap.ui.test.Opa5.getUtils();

					/**
					 * Programmatically triggers a 'keydown' event on a specified target.
					 * @see sap.ui.test.qunit.triggerKeyEvent
					 *
					 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
					 * @param {string | int} sKey The keys name as defined in <code>jQuery.sap.KeyCodes</code> or its key code
					 * @param {boolean} bShiftKey Indicates whether the shift key is down in addition
					 * @param {boolean} bAltKey Indicates whether the alt key is down in addition
					 * @param {boolean} bCtrlKey Indicates whether the ctrl key is down in addition
					 * @public
					 */
					oUtils.triggerKeyboardEvent(oControl.getId(), sKey, false, false, false);

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