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
	 * Constructor for a Unit of Measure.
	 *
	 * @class
	 * This class represents SAP Storage Location types.
	 *
	 */
	var ProcessOrderNumberType = StringType.extend("com.mii.scanner.model.type.ProcessOrderNumber", {

		//constructor : function(oFormatOptions, oConstraints)
		constructor: function() {
			StringType.apply(this, arguments);
			this.sName = "ProcessOrderNumber";

			if (typeof this.oConstraints.numericOnly === Util.undef) {
				this.oConstraints.numericOnly = true;
			}

			if (typeof this.oFormatOptions.hideLeadingZeros === Util.undef) {
				this.oFormatOptions.hideLeadingZeros = true;
			}

		}

	});

	ProcessOrderNumberType.prototype.formatValue = function(sValue, sInternalType) {
		if (typeof sValue === Util.undef || sValue === null || sValue === Util.blank) {
			return "";
		}

		// remove leading zeros
		if (this.oFormatOptions.hideLeadingZeros) {
			sValue = Util.trimLeadingZeros(sValue);
		}

		return sValue;
	};

	ProcessOrderNumberType.prototype.parseValue = function(oValue, sInternalType) {
		var sValue = StringType.prototype.parseValue.apply(this, arguments);

		// empty string is null
		// blank string is null
		if (sValue === Util.empty || sValue === Util.blank) {
			return this.oFormatOptions.emptyString;
		}

		// prefix leading zeros to store them in the model, if format options trim them
		if (this.oFormatOptions.hideLeadingZeros) {
			sValue = Util.padLeadingZeros(sValue, this.oConstraints.maxLength);
		}

		return sValue;
	};

	ProcessOrderNumberType.prototype.validateValue = function(sValue) {
		var aViolatedConstraints = [],
			aMessages = [],
			iNoLength = 0;

		if (this.oConstraints.numericOnly) {
			if (!jQuery.isNumeric(sValue)) {
				aViolatedConstraints.push("isNumeric");
				aMessages.push("Auftragsnummer '" + sValue + "' ist nicht gültig");
			}
		}

		if (aViolatedConstraints.length > iNoLength) {
			throw new ValidateException(aMessages.join(". "), aViolatedConstraints);
		}

		StringType.prototype.validateValue.apply(this, arguments);

	};

	return ProcessOrderNumberType;
});