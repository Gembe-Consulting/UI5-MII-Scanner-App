sap.ui.define([
	"sap/ui/model/type/Float",
	"sap/ui/model/type/Integer",
	"sap/ui/model/type/String"
], function(Float) {
	"use strict";

	return {

		QUAN: new sap.ui.model.type.Float({
			minIntegerDigits: 1, // minimal number of non-fraction digits
			maxIntegerDigits: 12, // maximal number of non-fraction digits
			minFractionDigits: 3, // minimal number of fraction digits
			maxFractionDigits: 3, // maximal number of fraction digits
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}),

		LENUM: new sap.ui.model.type.Integer({
			minIntegerDigits: 1, // minimal number of non-fraction digits
			maxIntegerDigits: 20, // maximal number of non-fraction digits
			emptyString: null // defines what empty string is parsed as and what is formatted as empty string
		}),

		LGORT: new sap.ui.model.type.String(null, {
			minLength: 4,
			maxLength: 4
		}),

		AUFNR: new sap.ui.model.type.String(null, {
			minLength: 7,
			maxLength: 7,
			startsWith: "1"
		}),

		MEINS: new sap.ui.model.type.String(null, {
			minLength: 1,
			maxLength: 4
		})

	};

});