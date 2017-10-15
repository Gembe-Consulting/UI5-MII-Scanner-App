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
	var _createMockServer = function(sMockServerUrl, sJsonFilesUrl) {
		// Create mockserver object
		if (!sMockServerUrl || !sJsonFilesUrl) {
			return;
		}

		return {
			rootUri: sMockServerUrl,
			requests: [{
				method: "GET",
				path: new RegExp(/(QueryTemplate)(.*)/),
				response: function(oXhr, sMiiServiceName, oUrlParameters) {
					jQuery.sap.log.debug("MockServer: incoming request for url:", oXhr.url, "MII-Mockserver");

					var mUrlParams = jQuery.sap.getUriParameters(oXhr.url),
						sQueryTemplatePath = mUrlParams.get(sMiiServiceName),
						sQueryTemplateName = sQueryTemplatePath.substr(sQueryTemplatePath.lastIndexOf("/") + 1),
						oResponse = jQuery.sap.syncGetJSON(sJsonFilesUrl + "/" + sQueryTemplateName + ".json"),
						mHeaders = {
							"Content-Type": "application/json;charset=utf-8"
						};

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
				aDataSources = oManifest["sap.app"].dataSources;

			jQuery.each(aDataSources, function(index, oDataSource) {
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oDataSource.uri) ? oDataSource.uri : oDataSource.uri + "/";

				var oMockServerConfig = _createMockServer(sMockServerUrl, sJsonFilesUrl);

				oMockServer = new MockServer(oMockServerConfig);

				var aRequests = oMockServer.getRequests();

				var fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

				// handling request errors
				if (sErrorParam) {
					aRequests.forEach(function(aEntry) {
						if (aEntry.path.toString().indexOf(sEntity) > -1) {
							fnResponse(iErrorCode, sErrorParam, aEntry);
						}
					});
				}

				oMockServer.start();
			}.bind(this));

			// configure mock server with a delay of 1s
			//MockServer.config({
			//	autoRespond: true,
			//	autoRespondAfter: (oUriParameters.get("serverDelay") || 1000)
			//});

			jQuery.sap.log.info("Running the app with mock data","","MII-Mockserver");
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer: function() {
			return oMockServer;
		}
	};

});