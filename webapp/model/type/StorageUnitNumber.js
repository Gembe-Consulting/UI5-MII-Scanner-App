sap.ui.define(['jquery.sap.global', 'sap/ui/model/type/String', 'sap/ui/model/FormatException', 'sap/ui/model/ParseException', 'sap/ui/model/ValidateException'],
	function(jQuery, StringType, FormatException, ParseException, ValidateException) {
		"use strict";
		/**
		 * Constructor for a Unit of Measure.
		 *
		 * @class
		 * This class represents SAP Storage Location types.
		 *
		 */
		var StorageUnitNumberType = StringType.extend("com.mii.scanner.model.type.StorageUnitNumber", {

			//constructor : function(oFormatOptions, oConstraints)
			constructor: function() {
				StringType.apply(this, arguments);
				this.sName = "StorageUnitNumber";
			}

		});

		StorageUnitNumberType.prototype.parseValue = function(oValue, sInternalType) {
			var sValue = StringType.prototype.parseValue.apply(this, arguments),
				iNoLength = 0;

			sValue = sValue.replace(/^0+/, "");

			if (sValue.length === iNoLength) {
				return this.oFormatOptions.emptyString;
			}

			return sValue;
		};

		StorageUnitNumberType.prototype.validateValue = function(sValue) {
			var aViolatedConstraints = [],
				aMessages = [],
				iNoLength = 0;

			if (!jQuery.isNumeric(sValue)) {
				aViolatedConstraints.push("isNumeric");
				aMessages.push("Palettennummer '" + sValue + "' ist nicht gültig");
			}

			if (aViolatedConstraints.length > iNoLength) {
				throw new ValidateException(aMessages.join(". "), aViolatedConstraints);
			}

			StringType.prototype.validateValue.apply(this, arguments);

		};

		return StorageUnitNumberType;
	});