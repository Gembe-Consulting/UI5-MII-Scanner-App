sap.ui.define([
	"jquery.sap.global",
	"./BaseTTController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(jQuery, BaseTTController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return BaseTTController.extend("com.mii.scanner.controller.action.tt.StartOperation", {

		sapType: sapType,
		formatter: formatter,

		_oInitData: {
			//user input data
			orderNumber: null,
			operationNumber: null,
			dateTimeValue: null,
			//external data
			AUFNR: null
		},

		onInit: function() {
			//call super class onInit to apply user login protection. DO NOT DELETE!
			BaseTTController.prototype.onInit.call(this);

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitData)), "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");

			this.getRouter()
				.getRoute("startOperation")
				.attachMatched(this._onRouteMatched, this);

		},

		//http: //su-mii-dev01.intern.suwelack.de:50000/XMII/Runner?Transaction=SUMISA/ProcessOrder/trx_SendBeginEndPhaseToSAP_TE&AUFNR=1093379&VORGANG=0010&STATUS=0003&STATUS_TXT=Gestartet&TRX_ID=B10&RUECKZEIT=01.05.2018 00:30:00&MATNR=1701705-030&STOER=&Debug=1&UNAME=PHIGEM&IllumLoginName=PHIGEM&OutputParameter=OutputXML&Content-Type=text/xml
		onSave: function() {
			var oDataModel = this.getModel("data"),
				oServiceData,
				fnResolve,
				fnReject;

			this.getOwnerComponent().showBusyIndicator();

			fnResolve = function(oData) {
				var oConfiramationNumber,
					aRows,
					iExactlyOne = 1;

				if (!oData.success) {

					this.addUserMessage({
						text: oData.lastErrorMessage
					});

					return;
				}

				aRows = oData.d.results[0].Rowset.results[0].Row.results;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === iExactlyOne) {
					oConfiramationNumber = aRows[0];
				} else {
					throw new Error(this.getTranslation("startOperation.messageText.resultIncomplete") + " @OpStart");
				}

				this.addUserMessage({
					text: this.getTranslation("startOperation.messageText.postingSuccessfull", [oServiceData.orderNumber, oServiceData.operationNumber, moment(oServiceData.date).format("LLLL")]),
					type: sap.ui.core.MessageType.Success
				});

				this.addMessageManagerMessage("Rückmeldung " + oConfiramationNumber.CONF_NO + " erfolgreich gebucht.");

			}.bind(this);

			fnReject = function(oError) {
				this.addUserMessage({
					text: oError.message
				});
			}.bind(this);

			oServiceData = {
				orderNumber: oDataModel.getProperty("/orderNumber"),
				operationNumber: oDataModel.getProperty("/operationNumber"),
				newStatus: this.oProcessOrderStatus.started,
				date: oDataModel.getProperty("/dateTimeValue"),
				materialNumber: oDataModel.getProperty("/MATNR")
			};

			//function(sOrderNumber, sOperationNumber, oStatus, oDate, sMaterialNumber, sIncident) || function(oServiceData)
			this.requestTimeTicketService(oServiceData)
				.then(fnResolve, fnReject)
				.then(this.getOwnerComponent().hideBusyIndicator)
				.then(function() {
					this.onClearFormPress({}, true /*bKeepMessageStrip*/ );
				}.bind(this));
		},

		isInputDataValid: function(oData) {
			return !!oData.dateTimeValue && !!oData.orderNumber && !!oData.operationNumber;
		},

		checkInputIsValid: function(oData) {
			var oOrderNumberInput = this.byId("orderNumberInput"),
				oOperationNumberInput = this.byId("operationNumberInput"),
				oDateTimeEntry = this.byId("dateTimeEntry"),
				oStartMoment;

			oDateTimeEntry.setValueState(sap.ui.core.ValueState.None);

			oStartMoment = moment(oData.dateTimeValue);

			// 0. check if necessary data is present
			if (!oData.AUFNR || !oData.dateTimeValue) {
				return false;
			}

			// 1. ensure operation status is valid
			if (oData.STATUS !== this.oProcessOrderStatus.released.STATUS_ID && oData.STATUS !== this.oProcessOrderStatus.paused.STATUS_ID) { // check if operation has status "Freigegeben"
				this.addUserMessage({
					text: this.getTranslation("startOperation.messageText.wrongCurrentStatus", [oData.AUFNR, oData.VORNR, oData.STATUS_TXT])
				});
				oOrderNumberInput.setValueState(sap.ui.core.ValueState.Error);
				oOperationNumberInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			// Last: Check min/max contrains for date input
			if (!this.checkDateTimeEntryMinMaxContraints(oStartMoment, oDateTimeEntry)) {
				return false;
			}

			// All good!
			oOrderNumberInput.setValueState(sap.ui.core.ValueState.Success);
			oOperationNumberInput.setValueState(sap.ui.core.ValueState.Success);
			oDateTimeEntry.setValueState(sap.ui.core.ValueState.Success);

			return true;
		}
	});
});