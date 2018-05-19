sap.ui.define([], function() {
	"use strict";

	// class providing static utility methods and values
	var Util = {};
	
	Util.undef = "undefined";

	Util.padLeadingZero = function padLeadingZero(sValue, iLength) {
		var sCharToPad = "0";

		return jQuery.sap.padLeft(sValue.toString(), sCharToPad, iLength);
	};

	Util.deleteLeadingZeros = function deleteLeadingZeros(sValue) {
		if (jQuery.type(sValue) === "string") {
			return sValue.replace(/^0+/, "");
		}

		return sValue.toString();
	};

	return Util;
});