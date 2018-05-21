sap.ui.define([
	"jquery.sap.global",
	"com/mii/scanner/controller/action/ActionBaseController"
], function(jQuery, ActionBaseController) {
	return ActionBaseController.extend("com.mii.scanner.controller.action.gm.BaseGMController", {

		_aDisallowedStorageLocations: [],

		onInit: function() {
			ActionBaseController.prototype.onInit.call(this); // DO NOT DELETE!
		},
		
		/**
		 * Check is a given storage location is allowed for posting
		 * 
		 * @param {string} sStorageLocation storage location
		 * @return {boolean} true if  storage location is allowed, false if not
		 */
		isStorageLocationAllowed: function(sStorageLocation) {
			var nonExistng = -1;

			return this._aDisallowedStorageLocations.indexOf(sStorageLocation.toUpperCase()) === nonExistng;
		},

		/**
		 * Brings storage unit data into user friendly format.
		 * LENUM and SOLLME are provided as string from MII backend.
		 * 
		 * @param {object} oStorageUnit storage unit
		 * @return {object} a storage unit with property LENUM and SOLLME formatted
		 */
		_formatStorageUnitData: function(oStorageUnit) {
			var fEmpty = 0.0;

			if (!oStorageUnit) {
				return null;
			}

			var fnNumberOrDefault = function(vAttr, vDefault) {
				return jQuery.isNumeric(vAttr) ? Number(vAttr) : vDefault;
			};

			oStorageUnit.LENUM = fnNumberOrDefault(oStorageUnit.LENUM, null);
			oStorageUnit.SOLLME = fnNumberOrDefault(oStorageUnit.SOLLME, fEmpty);

			return oStorageUnit;
		}

	});
});