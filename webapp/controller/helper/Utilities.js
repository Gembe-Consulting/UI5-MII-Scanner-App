sap.ui.define([], function() {
	"use strict";

	// class providing static utility methods and values
	var Util = {};
	
	Util.undef = "undefined";
	Util.empty = "";
	Util.blank = " ";

	Util.containsNonNumericChars = function containsNonNumericChars(sValue){
		return /[^$\d]/.test(sValue);
	};

	Util.padLeadingZeros = function padLeadingZeros(sValue, iLength) {
		var sCharToPad = "0";

		return jQuery.sap.padLeft(sValue.toString(), sCharToPad, iLength);
	};

	Util.trimLeadingZeros = function trimLeadingZeros(sValue) {
		if (jQuery.type(sValue) === "string") {
			return sValue.replace(/^0+/, "");
		}

		return sValue.toString();
	};

	return Util;
});