/**
 * JSON-based DataBinding for MII Services
 */

// Provides the JSON object based model implementation
sap.ui.define(["jquery.sap.global", "sap/ui/model/json/JSONModel"],
	function(jQuery, JSONModel) {
		"use strict";

		/**
		 * Constructor for a new MIIModel.
		 *
		 * @class
		 * Model implementation for JSON based MII Services
		 *
		 * @extends sap.ui.model.JSONModel
		 *
		 * @author Philipp Gembe
		 * @version 0.1
		 *
		 * @param {object} oData either the URL where to load the JSON from or a JS object
		 * @param {object} oURLParameters
		 * @public
		 */
		var MIIQueryModel = JSONModel.extend("com.mii.scanner.controller.MIIQueryModel", /** @lendscom.mii.scanner.controller.MIIQueryModel.prototype */ {
			constructor: function(sUrl, oURLParameters) {
				if (!sUrl || typeof sUrl !== "string") {
					jQuery.sap.log.error("Parameter sUrl must be type of string", null, this.toString());
					return;
				}
				JSONModel.apply(this, arguments);
				
				this._sUrl = sUrl;
			},

			metadata: {
				publicMethods: ["setMiiData", "getMiiData"]
			}
		});

		/**
		 * Override JSON Models loadData method, to only load data, if oURLParameters is given. 
		 * This is to ensure having proper input data for MII QueryTemplate
		 * @public
		 */
		MIIQueryModel.prototype.loadData = function(sUrl, oURLParameters, bAsync, sType, bMerge, bCache, mHeaders) {
			
			if (sUrl && typeof sUrl === "string" && oURLParameters) {
			
				JSONModel.prototype.loadData.apply(this, [sUrl, oURLParameters, bAsync, sType, bMerge, bCache, mHeaders]);

			} else {
				jQuery.sap.log.warning("Method loadData() is missing oURLParameters. Data not loaded.", null, this.toString());
			}

		};
		
		return MIIQueryModel;

	});