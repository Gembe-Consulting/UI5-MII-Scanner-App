sap.ui.define([
	"com/mii/scanner/libs/momentjs/moment"
], function() {
	"use strict";

	const LAST_STORAGE_UNIT_NUMBERS = [90025311000000000000, 90024811000000000000, 90000000000000000000 /* keep lagacy support */ ];
	const ZERO_STOCK_STORAGE_UNIT_QUANTITIES = [0.0, 0.001];

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
			return !sQuantity || ZERO_STOCK_STORAGE_UNIT_QUANTITIES.includes(parseFloat(sQuantity)); //!sQuantity || (fQuantity === fZero) || (fQuantity === fNearToZero);
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
			return !!sQuantity && !ZERO_STOCK_STORAGE_UNIT_QUANTITIES.includes(parseFloat(sQuantity)); //!!sQuantity && (fQuantity !== fZero) && (fQuantity !== fNearToZero);
		},

		/**
		 * Checks if a storage unit number is the last unit
		 * - if number is equal to 90025311000000000000 or 90024811000000000000
		 * - and if vStorageUnitNumber is not empty, null or undefined
		 * @public
		 * @param {string|number} vStorageUnitNumber storage unit to test for
		 * @return {boolean} true if is last, false if not last unit
		 */
		isLastStorageUnit: function(vStorageUnitNumber) {
			return LAST_STORAGE_UNIT_NUMBERS.includes(parseInt(vStorageUnitNumber, 10)); //return !!vStorageUnitNumber && 90000000000000000000 === parseInt(vStorageUnitNumber, 10);
		},

		/**
		 * Checks if a storage unit number is NOT the last unit
		 * - if number is not equal to 90025311000000000000 and 90024811000000000000
		 * - or if vStorageUnitNumber is not empty, null or undefined
		 * @public
		 * @param {string|number} vStorageUnitNumber storage unit to test for
		 * @return {boolean} true if is not last, false if last unit
		 */
		isNotLastStorageUnit: function(vStorageUnitNumber) {
			return !LAST_STORAGE_UNIT_NUMBERS.includes(parseInt(vStorageUnitNumber, 10)); //return !vStorageUnitNumber || 90000000000000000000 !== parseInt(vStorageUnitNumber, 10);
		}
	};
});