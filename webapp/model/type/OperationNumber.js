sap.ui.define([
	"jquery.sap.global",
	"sap/ui/model/type/String",
	"sap/ui/model/FormatException",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"com/mii/scanner/controller/helper/Utilities"
], function(jQuery, StringType, FormatException, ParseException, ValidateException, Util) {
	"use strict";
	/**
	 * Constructor for a Storage Location type.
	 *
	 * @class
	 * This class represents SAP Storage Location types.
	 *
	 */
	var OperationNumberType = StringType.extend("com.mii.scanner.model.type.OperationNumber", {

		//constructor : function(oFormatOptions, oConstraints)
		constructor: function() {
			StringType.apply(this, arguments);
			this.sName = "OperationNumber";

			if (typeof this.oConstraints.numericOnly === Util.undef) {
				this.oConstraints.numericOnly = true;
			}
		}

	});

	OperationNumberType.prototype.formatValue = function(sValue, sInternalType) {
		if (typeof sValue === Util.undef || sValue === null || sValue === Util.blank) {
			return "";
		}

		return sValue;
	};

	OperationNumberType.prototype.parseValue = function(oValue, sInternalType) {
		var sValue = StringType.prototype.parseValue.apply(this, arguments);

		// empty string is null
		// blank string is null
		if (sValue === Util.empty || sValue === Util.blank) {
			return this.oFormatOptions.emptyString;
		}

		if (this.oFormatOptions.padWithChar && sValue !== Util.empty && sValue !== Util.blank) {
			sValue = jQuery.sap.padLeft(oValue, this.oFormatOptions.padWithChar, this.oConstraints.maxLength);
		}

		return sValue;
	};

	OperationNumberType.prototype.validateValue = function(sValue) {
		var aViolatedConstraints = [],
			aMessages = [],
			iNoLength = 0;

		if (this.oConstraints.numericOnly) {
			if (!jQuery.isNumeric(sValue)) {
				aViolatedConstraints.push("isNumeric");
				aMessages.push("Vorgangsnummer '" + sValue + "' ist nicht gültig");
			}
		}

		if (aViolatedConstraints.length > iNoLength) {
			throw new ValidateException(aMessages.join(". "), aViolatedConstraints);
		}

		StringType.prototype.validateValue.apply(this, arguments);

	};
	
	return OperationNumberType;
});