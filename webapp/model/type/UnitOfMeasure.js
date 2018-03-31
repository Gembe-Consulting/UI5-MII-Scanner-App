sap.ui.define(['jquery.sap.global', 'sap/ui/model/type/String', 'sap/ui/model/FormatException', 'sap/ui/model/ParseException', 'sap/ui/model/ValidateException'],
	function(jQuery, StringType, FormatException, ParseException, ValidateException) {
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

			if (this.oFormatOptions && this.oFormatOptions.toUpperCase) {
				sValue = sValue.toUpperCase();
			}

			return sValue;
		};

		return UnitOfMeasureType;
	});