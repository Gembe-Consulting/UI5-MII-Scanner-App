sap.ui.define([
	"jquery.sap.global",
	"com/mii/scanner/controller/action/ActionBaseController"
], function(jQuery, ActionBaseController) {
	return ActionBaseController.extend("com.mii.scanner.controller.action.gm.BaseGMController", {
		onInit: function() {
			ActionBaseController.prototype.onInit.call(this); // DO NOT DELETE!
		},
		/**
		 * Check is a given storage location is allowed for posting
		 */
		isStorageLocationAllowed: function(sStorageLocation) {
			return this._aDisallowedStorageLocations.indexOf(sStorageLocation.toUpperCase()) === -1;
		},

		_formatStorageUnitData: function(oStorageUnit) {

			if (!oStorageUnit) {
				return null;
			}

			var fnNumberOrDefault = function(vAttr, vDefault) {
				return jQuery.isNumeric(vAttr) ? Number(vAttr) : vDefault;
			};

			oStorageUnit.LENUM = fnNumberOrDefault(oStorageUnit.LENUM, null);
			oStorageUnit.SOLLME = fnNumberOrDefault(oStorageUnit.SOLLME, 0.0);

			return oStorageUnit;
		}

	});
});