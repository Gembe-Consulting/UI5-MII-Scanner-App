sap.ui.define(['jquery.sap.global', 'sap/ui/model/type/String', 'sap/ui/model/FormatException', 'sap/ui/model/ParseException', 'sap/ui/model/ValidateException'],
	function(jQuery, StringType, FormatException, ParseException, ValidateException) {
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
			}

		});

		OperationNumberType.prototype.parseValue = function(oValue, sInternalType) {
			var sValue = StringType.prototype.parseValue.apply(this, arguments);

			if (sValue && this.oFormatOptions.padWithChar) {
				sValue = jQuery.sap.padLeft(oValue, this.oFormatOptions.padWithChar, this.oConstraints.maxLength);
			}

			return sValue;
		};

		return OperationNumberType;
	});