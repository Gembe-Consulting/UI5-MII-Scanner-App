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
	 * This class represents SAP Unit of Measure types.
	 *
	 */
	var UnitOfMeasureType = StringType.extend("com.mii.scanner.model.type.UnitOfMeasure", {

		//constructor : function(oFormatOptions, oConstraints)
		constructor: function() {
			StringType.apply(this, arguments);
			this.sName = "UnitOfMeasure";
		}

	});

	UnitOfMeasureType.prototype.parseValue = function(oValue, sInternalType) {
		var sValue = StringType.prototype.parseValue.apply(this, arguments);

		// empty string is null
		// blank string is null
		if (sValue === Util.empty || sValue === Util.blank) {
			return this.oFormatOptions.emptyString;
		}
		
		if (this.oFormatOptions && this.oFormatOptions.toUpperCase) {
			sValue = sValue.toUpperCase();
		}

		return sValue;
	};

	return UnitOfMeasureType;
});