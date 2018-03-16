sap.ui.define([
	"sap/ui/model/type/Float",
	"sap/ui/model/type/Integer",
	"sap/ui/model/type/String"
], function(FloatType, IntegerType, StringType) {
	"use strict";

	return {

		QUAN: new FloatType({
			minIntegerDigits: 1, // minimal number of non-fraction digits
			maxIntegerDigits: 12, // maximal number of non-fraction digits
			minFractionDigits: 3, // minimal number of fraction digits
			maxFractionDigits: 3, // maximal number of fraction digits
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}),

		LENUM: new IntegerType({
			minIntegerDigits: 1, // minimal number of non-fraction digits
			maxIntegerDigits: 20, // maximal number of non-fraction digits
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}),

		LGORT: new StringType(null, {
			minLength: 4,
			maxLength: 4,
			search: "^((?!VG01|vg01).)*$"
		}),

		AUFNR: new StringType(null, {
			minLength: 7,
			maxLength: 12
				//startsWith: "1",
				//search: "^[0-9]*$"
		}),

		MEINS: new StringType(null, {
			minLength: 1,
			maxLength: 4
		})

	};

});