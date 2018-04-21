sap.ui.define([
	"./BaseTTController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(BaseTTController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return BaseTTController.extend("com.mii.scanner.controller.action.tt.ResumeOperation", {

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

		_oInitView: {
			bValid: false,
			bOrderOperationValid: false,
			bDateTimeEntryValid: true,
			orderInputValueState: sap.ui.core.ValueState.None,
			dateTimeInputValueState: sap.ui.core.ValueState.None
		},

		onInit: function() {
			//call super class onInit to apply user login protection. DO NOT DELETE!
			BaseTTController.prototype.onInit.call(this);

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitData)), "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");

			this.getRouter()
				.getRoute("resumeOperation")
				.attachMatched(this._onRouteMatched, this);

		},

		onOrderChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				oOrderNumberInput = this.byId("orderNumberInput"),
				oOperationNumberInput = this.byId("operationNumberInput"),
				oDataModel = this.getModel("data"),
				sOrderNumber = oDataModel.getProperty("/orderNumber"),
				sOperationNumber = oDataModel.getProperty("/operationNumber"),
				fnResolve,
				fnReject,
				fnResolveIncidentService,
				fnCleanUp;

			/* check if current input is valid */
			if (!sOrderNumber || !sOperationNumber) {
				return;
			}
			if (this.controlHasValidationError(oSource)) {
				return;
			}

			/* Prepare UI: busy, value states, log messages */
			this.showControlBusyIndicator(oOrderNumberInput);
			this.showControlBusyIndicator(oOperationNumberInput);

			this.removeAllUserMessages();

			/* Prepare Data */

			/* Prepare success callback */
			fnResolve = function(oData) {
				var oOrderOperation = {
						AUFNR: null
					},
					aRows = oData.d.results[0].Rowset.results[0].Row.results,
					bOrderOperationValid = true;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 1) {
					oOrderOperation = aRows[0];
				} else {
					this.addUserMessage({
						text: this.getTranslation("resumeOperation.messageText.orderNotFound", [sOrderNumber, sOperationNumber])
					});

					bOrderOperationValid = false;
				}

				oDataModel.setData(oOrderOperation, true);

				this.getModel("view").setProperty("/bOrderOperationValid", bOrderOperationValid);

				if (bOrderOperationValid) {
					oOrderNumberInput.setValueState(sap.ui.core.ValueState.Success);
					oOperationNumberInput.setValueState(sap.ui.core.ValueState.Success);
				} else {
					oOrderNumberInput.setValueState(sap.ui.core.ValueState.Error);
					oOperationNumberInput.setValueState(sap.ui.core.ValueState.Error);
					return Promise.reject(new Error("Order or Operation not found!"));
				}

				return oData;

			};

			fnResolveIncidentService = function(oData) {
				var aRows = oData.d.results[0].Rowset.results[0].Row.results,
					oLatestInterruptionStartDate,
					oNullDate = null,
					fnLatestStartDate;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 0) {
					this.addUserMessage({
						text: this.getTranslation("resumeOperation.messageText.orderNotFound", [sOrderNumber, sOperationNumber])
					});

					return Promise.reject(new Error("No Interruption not found!"));
				}

				fnLatestStartDate = function(oldDate, oIncident, currentIndex, array) {
					var oNewDate = this.formatter.parseJSONDate(oIncident.STR_START);
					return oldDate > oNewDate ? oldDate : oNewDate;
				}.bind(this);

				oLatestInterruptionStartDate = aRows.reduce(fnLatestStartDate, oNullDate /*initial value*/ );

				// set LATEST_EVENT_FINISH property
				this.getModel("data").setProperty("/LATEST_EVENT_START", oLatestInterruptionStartDate);

				return oData;
			};

			/* Prepare error callback */
			fnReject = function(oError) {
				MessageBox.error(oError.responseText || oError.message, {
					title: this.getTranslation("error.miiTransactionErrorText", ["OrderOperationRead"]),
					contentWidth: "500px"
				});
				//oSource.setValueState(sap.ui.core.ValueState.Error).setValue("");
				this.getModel("view").setProperty("/bOrderOperationValid", false);
			};

			fnCleanUp = function(oDate) {
				this.hideControlBusyIndicator(oOrderNumberInput);
				this.hideControlBusyIndicator(oOperationNumberInput);
				this.updateViewControls(this.getModel("data").getData());
			};

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this.requestOrderOperationInfoService(sOrderNumber, sOperationNumber)
				.then(fnResolve.bind(this))
				.then(this.requestOrderOperationIncidentsService.bind(this))
				.then(fnResolveIncidentService.bind(this))
				.catch(fnReject.bind(this))
				.then(fnCleanUp.bind(this));
		},

		isInputDataValid: function(oData) {
			return !!oData.dateTimeValue && !!oData.orderNumber && !!oData.operationNumber;
		},

		checkInputIsValid: function(oData) {
			var oFinishMoment, // entry date by user
				oLastInterruptionStartMoment,
				oOrderNumberInput = this.byId("orderNumberInput"),
				oOperationNumberInput = this.byId("operationNumberInput"),
				oDateTimeInput = this.byId("dateTimeEntry");

			// 0. check if necessary data is present
			if (!oData.AUFNR || !oData.dateTimeValue) {
				return false;
			}

			oLastInterruptionStartMoment = moment(oData.LATEST_EVENT_START);

			// 1. ensure operation status is valid
			if (oData.STATUS !== this.oProcessOrderStatus.interrupted.STATUS_ID) { // check if operation has status "interrupted"
				this.addUserMessage({
					text: this.getTranslation("resumeOperation.messageText.wrongCurrentStatus", [oData.AUFNR, oData.VORNR, oData.STATUS_TXT])
				});
				oOrderNumberInput.setValueState(sap.ui.core.ValueState.Error);
				oOperationNumberInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			// 2. ensure entered finish date is after latest interruption start date
			if (oFinishMoment.isBefore(oLastInterruptionStartMoment)) {
				this.removeAllUserMessages();
				this.addUserMessage({
					text: this.getTranslation("resumeOperation.messageText.finishDateBeforeLastInterruptionDate", [oData.AUFNR, oData.VORNR, oLastInterruptionStartMoment.format("LLLL"), oFinishMoment.format("LLLL")])
				});
				oDateTimeInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			oOrderNumberInput.setValueState(sap.ui.core.ValueState.Success);
			oOperationNumberInput.setValueState(sap.ui.core.ValueState.Success);
			oDateTimeInput.setValueState(sap.ui.core.ValueState.Success);

			return true;
		}
	});
});