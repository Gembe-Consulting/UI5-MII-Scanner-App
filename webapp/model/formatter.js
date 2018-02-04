sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

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
		 * @public
		 * @param {string|number} sQuantity the quantity of the storage unit (commonly ISTME)
		 * @returns {boolean}
		 */
		isEmptyStorageUnit: function(sQuantity) {
			var fQuantity = parseFloat(sQuantity),
				fZero = 0.0,
				fNearToZero = 0.001;

			return (fQuantity === fZero) || (fQuantity === fNearToZero);
		},
		/**
		 * Checks if a storage unit quantity is considered full / non-empty:
		 * - if quantity not 0
		 * - if qunatity not 0.001
		 * @public
		 * @param {string|number} sQuantity the quantity of the storage unit (commonly ISTME)
		 * @returns {boolean}
		 */
		isFullStorageUnit: function(sQuantity) {
			var fQuantity = parseFloat(sQuantity),
				fZero = 0.0,
				fNearToZero = 0.001;

			return (fQuantity !== fZero) && (fQuantity !== fNearToZero);
		},

		/**
		 * Defines a value state based on the stock level
		 *
		 * @public
		 * @param {number} iValue the stock level of a product
		 * @returns {string} sValue the state for the stock level
		 */
		quantityState: function(iValue) {
			if (iValue === 0) {
				return "Error";
			} else if (iValue <= 10) {
				return "Warning";
			} else {
				return "Success";
			}
		}

	};

});