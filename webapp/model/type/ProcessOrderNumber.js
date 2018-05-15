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
		var ProcessOrderNumberType = StringType.extend("com.mii.scanner.model.type.ProcessOrderNumber", {

			//constructor : function(oFormatOptions, oConstraints)
			constructor: function() {
				StringType.apply(this, arguments);
				this.sName = "ProcessOrderNumber";
			}

		});

		ProcessOrderNumberType.prototype.formatValue = function(sValue, sInternalType) {
			var oValue = StringType.prototype.formatValue.apply(this, arguments),
				iNoLength = 0;

			if (oValue && oValue.length === iNoLength) {
				return this.oFormatOptions.emptyString;
			}

			return sValue;
		};

		ProcessOrderNumberType.prototype.parseValue = function(oValue, sInternalType) {
			var sValue = StringType.prototype.parseValue.apply(this, arguments),
				iNoLength = 0;

			sValue = sValue.replace(/^0+/, "");

			if (sValue.length === iNoLength) {
				return this.oFormatOptions.emptyString;
			}

			return sValue;
		};

		ProcessOrderNumberType.prototype.validateValue = function(sValue) {
			var aViolatedConstraints = [],
				aMessages = [],
				iNoLength = 0;

			if (!jQuery.isNumeric(sValue)) {
				aViolatedConstraints.push("isNumeric");
				aMessages.push("Auftragsnummer '" + sValue + "' ist nicht gültig");
			}

			if (aViolatedConstraints.length > iNoLength) {
				throw new ValidateException(aMessages.join(". "), aViolatedConstraints);
			}

			StringType.prototype.validateValue.apply(this, arguments);

		};

		return ProcessOrderNumberType;
	});