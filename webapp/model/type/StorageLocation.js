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
	var StorageLocationType = StringType.extend("com.mii.scanner.model.type.StorageLocation",{

		//constructor : function(oFormatOptions, oConstraints)
		constructor : function () {
			StringType.apply(this, arguments);
			this.sName = "StorageLocation";
		}

	});
	
	StorageLocationType.prototype.validateValue = function(sValue) {
		var aViolatedConstraints = [],
			aMessages = [],
			sUpperCaseValue = sValue.toUpperCase();
			
		StringType.prototype.validateValue.apply(this, arguments);
		
		if (this.oConstraints && this.oConstraints.exludedStorageLocations){
			if(typeof this.oConstraints.exludedStorageLocations === "string"){
				this.oConstraints.exludedStorageLocations = [ this.oConstraints.exludedStorageLocations ];
			}
			
			if (this.oConstraints.exludedStorageLocations.includes(sUpperCaseValue)) {
				aViolatedConstraints.push("exludedStorageLocations");
				aMessages.push("Lagerort '"+sValue+"' ist nicht erlaubt");
			}
			
		}

		if (aViolatedConstraints.length > 0) {
			throw new ValidateException(aMessages.join(". "), aViolatedConstraints);
		}
	};
	
	return StorageLocationType;
});