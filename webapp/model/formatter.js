sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Checks if a given date is before current data
		 * @public
		 * @param {string} sDate the date you want to compare to
		 * @param {string} sFormat the format the date is provided in (default: MM-DD-YYYY)
		 * @returns {boolean} 
		 */
		isPastDate: function(sDate, sFormat) {
			var oToday = moment(),
				oDate = moment(sDate, sFormat || "MM-DD-YYYY");

			return oDate.isBefore(oToday);
		},

		/**
		 * Checks if a storage unit quantity is considered empty:
		 * - if quantity is 0
		 * - if qunatity is 0.001
		 * - if quantity is null or undefined
		 * @public
		 * @param {string|number} sQuantity the quantity of the storage unit (commonly ISTME)
		 * @returns {boolean} true if storage unit is considered empty, false if full
		 */
		isEmptyStorageUnit: function(sQuantity) {
			var fQuantity = parseFloat(sQuantity),
				fZero = 0.0,
				fNearToZero = 0.001;

			return !sQuantity || (fQuantity === fZero) || (fQuantity === fNearToZero);
		},
		/**
		 * Checks if a storage unit quantity is considered full / non-empty:
		 * - if quantity not 0
		 * - if qunatity not 0.001
		 * - if quantity is null or undefined
		 * @public
		 * @param {string|number} sQuantity the quantity of the storage unit (commonly ISTME)
		 * @returns {boolean} true if storage unit is considered full, false if empty
		 */
		isFullStorageUnit: function(sQuantity) {
			var fQuantity = parseFloat(sQuantity),
				fZero = 0.0,
				fNearToZero = 0.001;

			return !sQuantity || (fQuantity !== fZero) && (fQuantity !== fNearToZero);
		}
	};
});