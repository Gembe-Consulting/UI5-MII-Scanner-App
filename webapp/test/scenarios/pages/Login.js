sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/actions/Press',
	'sap/ui/test/matchers/BindingPath',
	'sap/ui/test/matchers/AggregationLengthEquals',
	'sap/ui/test/matchers/Properties',
	'sap/ui/test/matchers/PropertyStrictEquals'
], function (Opa5,
			 Press,
			 BindingPath,
			 AggregationLengthEquals,
			 Properties,
			 PropertyStrictEquals) {
	"use strict";

	Opa5.createPageObjects({
		onDummyPage: {
			actions: {
			},
			assertions: {
				iShallPass: function (sUsername) {
					return this.waitFor({
						success: function () {
							Opa5.assert.ok(true, sUsername + " shall pass");
						}
					});
				}
			}
		}
	});

});