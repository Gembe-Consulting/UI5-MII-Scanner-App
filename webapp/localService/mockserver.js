sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "com/mii/scanner/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata/";

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
						oResponse = jQuery.sap.syncGetJSON(sJsonFilesUrl + "/" + sQueryTemplateName + ".json", {
							"_": new Date().getTime()
						}),
						mHeaders = {
							"Content-Type": "application/json;charset=utf-8"
						},
						sMessage, sStatusCode,
						fnServiceDataProcessing = "fn" + sQueryTemplateName;

					if (!oResponse.success) {
						sMessage = Response.status + ": " + oResponse.error || "Fatal application exception.";
						sStatusCode = oResponse.statusCode || "999";
						oXhr.respond(sStatusCode, mHeaders, sMessage);

						jQuery.sap.log.debug("MockServer: response sent with: " + sStatusCode + ": " + sMessage, JSON.stringify(oResponse.data), "MII-Mockserver");

						return false;
					}

					if (oRef[fnServiceDataProcessing] && oRef[fnServiceDataProcessing] instanceof Function) {
						jQuery.sap.log.debug("Post-Processing data with" + JSON.stringify(oRef[fnServiceDataProcessing]), "MII-Mockserver");
						oResponse.data = oRef[fnServiceDataProcessing](oResponse.data, mUrlParams);
					} else {
						jQuery.sap.log.debug("NoPost-Processing of data", "MII-Mockserver");
					}

					oXhr.respond(200, mHeaders, JSON.stringify(oResponse.data));

					jQuery.sap.log.debug("MockServer: response sent with: 200:", JSON.stringify(oResponse.data), "MII-Mockserver");

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
				sEntity = "QueryTemplate",
				sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
				sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				aDataSources = oManifest["sap.app"].dataSources,
				oDataSource = aDataSources.illuminatorService;

			// ensure there is a trailing slash
			sMockServerUrl = /.*\/$/.test(oDataSource.uri) ? oDataSource.uri : oDataSource.uri + "/";

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 0)
			});

			var oMockServerConfig = _createMockServer(sMockServerUrl, sJsonFilesUrl, this);

			oMockServer = new MockServer(oMockServerConfig);

			// handling request errors
			if (sErrorParam) {
				var aRequests = oMockServer.getRequests();

				var fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
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
			if(sUserName === "PHIGEM"){
				return oData;	
			}

			oData.d.results[0].Rowset.results[0].Row.results = [];
			return oData;
		},
		
		fnxac_ReadPaletteInfo: function(oData, oParams) {
			var sLeNum = oParams.get("Param.1");
			if(sLeNum === "00000000109330000001"){
				return oData;	
			}

			oData.d.results[0].Rowset.results[0].Row.results = [];
			return oData;
		}
	};

});