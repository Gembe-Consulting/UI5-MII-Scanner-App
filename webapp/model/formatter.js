sap.ui.define([
	"com/mii/scanner/libs/momentjs/moment"
], function() {
	"use strict";

	return {

		/**
		 * Checks if a given date is before current date
		 * @public
		 * @param {string} sDate the date you want to compare to
		 * @param {string} sFormat the format the date is provided in (default: MM-DD-YYYY)
		 * @returns {boolean} 
		 */
		isPastDate: function(sDate, sFormat) {
			var oToday = moment(),
				oDate = moment(sDate, sFormat || "MM-DD-YYYY");

			return oDate.isBefore(oToday, 'day');
		},

		/**
		 * Checks if a storage unit quantity is considered empty:
		 * - if quantity is 0
		 * - if qunatity is 0.001
		 * - if quantity is null or undefined or ""
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
		 * - if quantity is not null and not undefined and not ""
		 * @public
		 * @param {string|number} sQuantity the quantity of the storage unit (commonly ISTME)
		 * @returns {boolean} true if storage unit is considered full, false if empty
		 */
		isFullStorageUnit: function(sQuantity) {
			var fQuantity = parseFloat(sQuantity),
				fZero = 0.0,
				fNearToZero = 0.001;

			return !!sQuantity && (fQuantity !== fZero) && (fQuantity !== fNearToZero);
		},

		/**
		 * Checks if a storage unit number is the last unit
		 * - if number is equal to 90000000000000000000
		 * - and if vStorageUnitNumber is not empty, null or undefined
		 * @public
		 * @param {string|number} vStorageUnitNumber storage unit to test for
		 * @return {boolean} true if is last, false if not last unit
		 */
		isLastStorageUnit: function(vStorageUnitNumber) {
			var iLastStorageUnit = 90000000000000000000;
			return !!vStorageUnitNumber && iLastStorageUnit === parseInt(vStorageUnitNumber, 10);
		},

		/**
		 * Checks if a storage unit number is NOT the last unit
		 * - if number is not equal to 90000000000000000000
		 * - or if vStorageUnitNumber is not empty, null or undefined
		 * @public
		 * @param {string|number} vStorageUnitNumber storage unit to test for
		 * @return {boolean} true if is not last, false if last unit
		 */
		isNotLastStorageUnit: function(vStorageUnitNumber) {
			var iLastStorageUnit = 90000000000000000000;
			return !vStorageUnitNumber || iLastStorageUnit !== parseInt(vStorageUnitNumber, 10);
		}
	};
});