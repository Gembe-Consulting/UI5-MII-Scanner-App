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
	var StorageLocationType = StringType.extend("com.mii.scanner.model.type.StorageLocation", {

		//constructor : function(oFormatOptions, oConstraints)
		constructor: function() {
			StringType.apply(this, arguments);
			this.sName = "StorageLocation";
		}

	});

	StorageLocationType.prototype.formatValue = function(sValue, sInternalType) {
		if (typeof sValue === Util.undef || sValue === null || sValue === Util.blank) {
			return "";
		}

		// convert to upper case
		if (this.oFormatOptions && this.oFormatOptions.toUpperCase) {
			sValue = sValue.toUpperCase();
		}

		return sValue;
	};

	StorageLocationType.prototype.parseValue = function(oValue, sInternalType) {
		var sValue = StringType.prototype.parseValue.apply(this, arguments);

		// empty string is null
		// blank string is null
		if (sValue === Util.empty || sValue === Util.blank) {
			return this.oFormatOptions.emptyString;
		}

		// convert to upper case
		if (this.oFormatOptions && this.oFormatOptions.toUpperCase) {
			sValue = sValue.toUpperCase();
		}

		return sValue;
	};

	StorageLocationType.prototype.validateValue = function(sValue) {
		var aViolatedConstraints = [],
			aMessages = [],
			iNoLength = 0,
			notFound = -1;

		if (this.oConstraints && this.oConstraints.exludedStorageLocations) {
			if (typeof this.oConstraints.exludedStorageLocations === "string") {
				this.oConstraints.exludedStorageLocations = [this.oConstraints.exludedStorageLocations];
			}

			if (jQuery.inArray(sValue, this.oConstraints.exludedStorageLocations) !== notFound) {
				aViolatedConstraints.push("exludedStorageLocations");
				aMessages.push("Lagerort '" + sValue + "' ist nicht erlaubt");
			}

		}

		if (aViolatedConstraints.length > iNoLength) {
			throw new ValidateException(aMessages.join(". "), aViolatedConstraints);
		}

		StringType.prototype.validateValue.apply(this, arguments);

	};

	return StorageLocationType;
});