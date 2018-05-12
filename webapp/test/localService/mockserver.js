sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "com/mii/scanner/",
		_sJsonFilesModulePath = _sAppModulePath + "test/localService/mockdata/";

	/**
	 * @private returns an parameter object to setup a mockserver
	 * @returns {Object} Config object
	 */
	var _createMockServer = function(sMockServerUrl, sJsonFilesUrl, oRef) {
		// Create mockserver object
		if (!sMockServerUrl || !sJsonFilesUrl) {
			return;
		}

		return {
			rootUri: sMockServerUrl,
			requests: [{
				method: "GET",
				path: /(QueryTemplate)(.*)$/,
				response: function(oXhr, sMiiServiceName, oUrlParameters) {
					jQuery.sap.log.debug("MockServer: incoming request for url:", oXhr.url, "MII-Mockserver");

					var mUrlParams = jQuery.sap.getUriParameters(oXhr.url),
						sQueryTemplatePath = mUrlParams.get(sMiiServiceName),
						sQueryTemplateName = sQueryTemplatePath.substr(sQueryTemplatePath.lastIndexOf("/") + 1),
						oUriParameters = jQuery.sap.getUriParameters(),
						sErrorServiceName = oUriParameters.get("errorServiceName"),
						sErrorServiceMessage = oUriParameters.get("errorServiceMessage"),
						sErrorServiceType = oUriParameters.get("errorServiceType"),
						bErrorState = sErrorServiceName === sQueryTemplateName,
						oResponse,
						mHeaders = {
							"Content-Type": "application/json;charset=utf-8"
						},
						sMessage, sStatusCode,
						fnServiceDataProcessing = "fn" + sQueryTemplateName;

					if (bErrorState && sErrorServiceType === "badRequest") {
						oXhr.respond(400, mHeaders, "Mockserver response: errorService '" + sErrorServiceName + "' not available!");
						return false;
					}

					if (bErrorState && sErrorServiceType === "emptyRequest") {
						oResponse = jQuery.sap.syncGetJSON(sJsonFilesUrl + "/" + "_EmptyRowsetResultError.json");
					} else if (bErrorState && sErrorServiceType === "fatalError") {
						oResponse = jQuery.sap.syncGetJSON(sJsonFilesUrl + "/" + sErrorServiceName + "_FatalError.json");
						if (!oResponse.success) {
							oResponse = jQuery.sap.syncGetJSON(sJsonFilesUrl + "/" + "_FatalError.json");
						}
						oResponse.data.d.results["0"].FatalError = sErrorServiceMessage;
					} else {
						oResponse = jQuery.sap.syncGetJSON(sJsonFilesUrl + "/" + sQueryTemplateName + ".json", {
							"_": new Date().getTime()
						});
					}

					if (!oResponse.success) {
						sMessage = oResponse.status + ": " + oResponse.error || "Fatal application exception.";
						sStatusCode = oResponse.statusCode || "999";

						jQuery.sap.log.debug("MockServer: response sent with: " + sStatusCode + ": " + sMessage, JSON.stringify(oResponse.data), "MII-Mockserver");

						oXhr.respond(sStatusCode, mHeaders, sMessage);

						return false;
					}

					if (!bErrorState && oRef[fnServiceDataProcessing] && oRef[fnServiceDataProcessing] instanceof Function) {
						jQuery.sap.log.debug("Post-Processing data with" + JSON.stringify(oRef[fnServiceDataProcessing]), "MII-Mockserver");
						oResponse.data = oRef[fnServiceDataProcessing](oResponse.data, mUrlParams);
					} else {
						jQuery.sap.log.debug("NoPost-Processing of data", "MII-Mockserver");
					}

					jQuery.sap.log.debug("MockServer: response sent with: 200:", JSON.stringify(oResponse.data), "MII-Mockserver");

					oXhr.respond(200, mHeaders, JSON.stringify(oResponse.data));

					return true;
				}
			}]
		};
	};

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */
		init: function() {
			var sMockServerUrl,
				oUriParameters = jQuery.sap.getUriParameters(),
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				sErrorService = oUriParameters.get("errorService"),
				sEntity = "QueryTemplate",
				sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
				sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl)
				.data,
				aDataSources = oManifest["sap.app"].dataSources,
				oDataSource = aDataSources.illuminatorService;

			// ensure there is a trailing slash
			sMockServerUrl = /.*\/$/.test(oDataSource.uri) ? oDataSource.uri : oDataSource.uri + "/";

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 1000)
			});

			var oMockServerConfig = _createMockServer(sMockServerUrl, sJsonFilesUrl, this);

			oMockServer = new MockServer(oMockServerConfig);

			// handling request errors for all services
			if (sErrorParam && sErrorService === "all") {
				var aRequests = oMockServer.getRequests();

				var fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString()
						.indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}

			oMockServer.start();

			jQuery.sap.log.info("Running the app with mock data", "", "MII-Mockserver");
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer: function() {
			return oMockServer;
		},

		fnFindScannerUserQry: function(oData, oParams) {
			var sUserName = oParams.get("Param.1");
			if (sUserName === "PHIGEM") {
				return oData;
			}

			oData.d.results[0].Rowset.results[0].Row.results = [];

			return oData;
		},

		fnStorageUnitReadXac: function(oData, oParams) {
			var sLENum = oParams.get("Param.1"),
				aLEList = oData.d.results[0].Rowset.results[0].Row.results;

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aLEList, function(oLE, index) {
				return jQuery.sap.endsWith(oLE.LENUM, sLENum);
			});

			return oData;
		},

		fnGoodsMovementCreateXac: function(oData, oParams) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sStorageUnitNumber = oParams.get("Param.1"),
				aStorageUnitList = oData.d.results[0].Rowset.results[0].Row.results,
				sErrorMessage = oUriParameters.get("applicationError");

			if (sErrorMessage) {
				oData.d.results[0].FatalError = "Forcefull application error:: \'" + sErrorMessage + "\'";
				return oData;
			}

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aStorageUnitList, function(oRow, index) {
				return jQuery.sap.endsWith(oRow.LENUM, sStorageUnitNumber);
			});

			return oData;
		},

		fnGoodsMovementRollerConveyorCreateXac: function(oData, oParams) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sRessourceId = oParams.get("Param.2"),
				aStorageUnitList = oData.d.results[0].Rowset.results[0].Row.results,
				sErrorMessage = oUriParameters.get("applicationError");

			if (sErrorMessage) {
				oData.d.results[0].FatalError = "Forcefull application error:: \'" + sErrorMessage + "\'";
				return oData;
			}

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aStorageUnitList, function(oRow, index) {
				return jQuery.inArray(sRessourceId, oRow.LENUM) > -1;
			});

			return oData;
		},

		fnGetOrderComponentQry: function(oData, oParams) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sMaterialNumber = oParams.get("Param.2"),
				aMaterialNumberList = oData.d.results[0].Rowset.results[0].Row.results;

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aMaterialNumberList, function(oRow, index) {
				return oRow.MATNR === sMaterialNumber;
			});

			return oData;
		},

		fnGetOrderHeaderQry: function(oData, oParams) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sOrderNumber = oParams.get("Param.1"),
				aOrderNumberList = oData.d.results[0].Rowset.results[0].Row.results;

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aOrderNumberList, function(oRow, index) {
				return jQuery.sap.endsWith(oRow.AUFNR, sOrderNumber);
			});

			return oData;
		},

		fnGetCurrentProcessOrderQry: function(oData, oParams) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sRessourceId = oParams.get("Param.1"),
				aOrderNumberList = oData.d.results[0].Rowset.results[0].Row.results;

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aOrderNumberList, function(oRow, index) {
				return oRow.ARBID === sRessourceId;
			});

			return oData;
		},

		fnStorageUnitCreateXac: function(oData, oParams) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sStorageUnit = oParams.get("Param.4"),
				aStorageUnitList = oData.d.results[0].Rowset.results[0].Row.results;

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aStorageUnitList, function(oRow, index) {
				return jQuery.sap.endsWith(oRow.LENUM, sStorageUnit);
			});

			return oData;
		},

		fnGetOrderOperationQry: function(oData, oParams) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sOrderNumber = oParams.get("Param.1"),
				sOperationNumber = oParams.get("Param.2"),
				aOperationList = oData.d.results[0].Rowset.results[0].Row.results;

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aOperationList, function(oRow, index) {
				return oRow.AUFNR === sOrderNumber && oRow.VORNR === sOperationNumber;
			});

			return oData;
		},

		fnGetOrderIncidentsQry: function(oData, oParams) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sOrderNumber = oParams.get("Param.1"),
				sOperationNumber = oParams.get("Param.2"),
				aIncidentList = oData.d.results[0].Rowset.results[0].Row.results;

			oData.d.results[0].Rowset.results[0].Row.results = jQuery.grep(aIncidentList, function(oRow, index) {
				return oRow.AUFNR === sOrderNumber && oRow.VORNR === sOperationNumber;
			});

			return oData;
		}
	};

});