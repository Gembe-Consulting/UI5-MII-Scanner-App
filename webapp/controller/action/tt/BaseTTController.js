sap.ui.define([
	"com/mii/scanner/controller/action/ActionBaseController",
	"sap/m/MessageBox",
	"sap/suite/ui/microchart/StackedBarMicroChartBar",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(ActionBaseController, MessageBox, StackedBarMicroChartBar, sapType, formatter) {
	return ActionBaseController.extend("com.mii.scanner.controller.action.tt.BaseTTController", {
		sapType: sapType,
		formatter: formatter,
		oProcessOrderStatus: {
			released: {
				"STATUS_TXT": "Freigegeben",
				"STATUS_ID": "0002",
				"STATUS_ICON": "sap-icon://sys-enter",
				"STATUS_COLOR": "#05B074",
				"ACTION_KEY": null
			},
			started: {
				"STATUS_TXT": "Gestartet",
				"STATUS_ID": "0003",
				"STATUS_ICON": "sap-icon://initiative",
				"STATUS_COLOR": "#BB07FF",
				"ACTION_KEY": "B10"
			},
			finished: {
				"STATUS_TXT": "Beendet",
				"STATUS_ID": "0045",
				"STATUS_ICON": "ap-icon://stop",
				"STATUS_COLOR": "#330066",
				"ACTION_KEY": "B40"
			},
			closed: {
				"STATUS_TXT": "Abgeschlossen",
				"STATUS_ID": "0046",
				"STATUS_ICON": "sap-icon://locked",
				"STATUS_COLOR": "#AAAAAA",
				"ACTION_KEY": null
			},
			interrupted: {
				"STATUS_TXT": "Störung",
				"STATUS_ID": "0098",
				"STATUS_ICON": "sap-icon://warning2",
				"STATUS_COLOR": "#FFAC00",
				"ACTION_KEY": "B30"
			},
			paused: {
				"STATUS_TXT": "Pausiert",
				"STATUS_ID": "0097",
				"STATUS_ICON": "sap-icon://pause",
				"STATUS_COLOR": "#006E9E",
				"ACTION_KEY": "B20"
			}
		},
		_oInitView: {
			bValid: false,
			bOrderOperationExists: false,
			orderInputValueState: sap.ui.core.ValueState.None,
			dateTimeInputValueState: sap.ui.core.ValueState.None,
			minDate: null,
			maxDate: null
		},

		onInit: function() {
			ActionBaseController.prototype.onInit.call(this); // DO NOT DELETE!

			this.getView().addEventDelegate({
				onBeforeShow: this._refreshDateValue
			}, this);
		},

		onOrderChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				oOrderNumberInput = this.byId("orderNumberInput"),
				oOperationNumberInput = this.byId("operationNumberInput"),
				oDataModel = this.getModel("data"),
				sOrderNumber = oDataModel.getProperty("/orderNumber"),
				sOperationNumber = oDataModel.getProperty("/operationNumber"),
				fnResolveOrderService,
				fnResolveIncidentService,
				fnReject,
				fnCleanUp;

			/* check if current input is valid */
			if (!sOrderNumber || !sOperationNumber || this.controlHasValidationError(oSource)) {
				this.updateViewControls(oDataModel.getData());
				return;
			}

			/* Prepare UI: busy, value states, log messages */
			this.showControlBusyIndicator(oOrderNumberInput);
			this.showControlBusyIndicator(oOperationNumberInput);

			this.removeAllUserMessages();

			/* Prepare Data */

			/* Prepare success callback */
			fnResolveOrderService = function(oData) {
				var oOperation,
					aRows = oData.d.results[0].Rowset.results[0].Row.results;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 1) {
					oOperation = aRows[0];
				} else {
					return Promise.reject(new Error(this.getTranslation("baseTTControllerOperation.messageText.orderNotFound", [sOrderNumber, sOperationNumber])));
				}

				oDataModel.setData(oOperation, true);

				this.getModel("view").setProperty("/bOrderOperationExists", true);

				return oData;
			};

			fnResolveIncidentService = function(oData) {
				var oLatestInterruption,
					aRows = oData.d.results[0].Rowset.results[0].Row.results,
					oNull = null,
					fnGetLatestInterruption,
					fnParseDate = this.formatter.parseJSONDate;

				fnGetLatestInterruption = function(oPrevIncident, oIncident, currentIndex, array) {
					var oNewDate = fnParseDate(oIncident.STR_BEGINN),
						oOldDate = oPrevIncident ? fnParseDate(oPrevIncident.STR_BEGINN) : oNewDate;
					if (oOldDate > oNewDate) {
						return oPrevIncident;
					}
					return oIncident;
				};

				oLatestInterruption = aRows.reduce(fnGetLatestInterruption, oNull /*initial value*/ );

				// set properties to data model
				this.getModel("data").setProperty("/latestInterruption", oLatestInterruption);
				this.getModel("data").setProperty("/interruptions", aRows);

				return oData;
			};

			/* Prepare error callback */
			fnReject = function(oError) {
				var oOperation = {
					AUFNR: null
				};
				oDataModel.setData(oOperation, true);
				this.addUserMessage({
					text: oError.responseText || oError.message
				});
				this.getModel("view").setProperty("/bOrderOperationExists", false);
				oOrderNumberInput.setValueState(sap.ui.core.ValueState.Error);
				oOperationNumberInput.setValueState(sap.ui.core.ValueState.Error);
			};

			fnCleanUp = function(oDate) {
				this.hideControlBusyIndicator(oOrderNumberInput);
				this.hideControlBusyIndicator(oOperationNumberInput);
				this.updateViewControls(this.getModel("data").getData());
			};

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this.requestOrderOperationInfoService(sOrderNumber, sOperationNumber)
				.then(fnResolveOrderService.bind(this))
				.then(this.requestOrderOperationIncidentsService.bind(this))
				.then(fnResolveIncidentService.bind(this))
				.catch(fnReject.bind(this))
				.then(fnCleanUp.bind(this));
		},

		updateViewControls: function(oData) {
			var oViewModel = this.getModel("view"),
				bOrderOperationExists = oViewModel.getProperty("/bOrderOperationExists"),
				bInputValuesComplete,
				bInputIsValid,
				bNoErrorMessagesActive,
				bReadyForPosting;

			// check if all required input data is present
			bInputValuesComplete = this.isInputDataValid(oData);

			// check if status and date input is allowed
			bInputIsValid = this.checkInputIsValid(oData);

			// check if all input data has proper format
			bNoErrorMessagesActive = this.isMessageModelClean();

			// we are ready for posting once we have complete and proper formatted input
			bReadyForPosting = bOrderOperationExists && bInputValuesComplete && bInputIsValid && bNoErrorMessagesActive;

			oViewModel.setProperty("/bValid", bReadyForPosting);
		},

		checkDateTimeEntryMinMaxContraints: function(oDateTimeEntryMoment, oDateTimeEntryControl) {
			var minMoment = moment(this._oMinDate),
				maxMoment = moment();

			if (oDateTimeEntryMoment.isBefore(minMoment, "day")) {
				oDateTimeEntryControl.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Eingabezeitpunkt ist zu klein. Eingabe nur ab '" + minMoment.format("LLL") + "' möglich.");
				return true;
			} else if (oDateTimeEntryMoment.isAfter(maxMoment)) {
				oDateTimeEntryControl.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Eingabezeitpunkt ist zu groß. Eingabe nur bis '" + maxMoment.format("LLL") + "' möglich.");
				return false;
			}

			return true;
		},

		onOrderNumberInputChange: function(oEvent) {
			this.onOrderChange(oEvent);
		},

		onOperationNumberInputChange: function(oEvent) {
			this.onOrderChange(oEvent);
		},

		onDateTimeEntryChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				oData = this.getModel("data").getData(),
				bValid = oEvent.getParameter("valid");

			oSource.setValueState(sap.ui.core.ValueState.None);
			this.removeAllUserMessages();

			if (!bValid) {
				oSource.setDateValue(this._oLastValidDate || new Date());
				//oSource.setValueState(sap.ui.core.ValueState.Warning).setValueStateText("Eingabezeitpunkt '" + oEvent.getParameter("value") + "' ungültig. Eingabe wurde auf 'jetzt' zurückgesetzt.");
			} else {
				this._oLastValidDate = oSource.getDateValue();
			}

			this.updateViewControls(oData);
		},

		onReasonSelectionChange: function(oEvent) {
			var oData = this.getModel("data").getData();
			this.removeAllUserMessages();
			this.updateViewControls(oData);
		},

		_refreshDateValue: function() {
			var iFutureOffset = 0,
				iPastOffset = 7;

			this._oInitData.dateTimeValue = new Date();
			this.getModel("data").setProperty("/dateTimeValue", this._oInitData.dateTimeValue);

			// prepare min and max date
			this._oInitView.minDate = moment().subtract(iPastOffset, "days").toDate();
			this._oInitView.maxDate = moment().add(iFutureOffset, "days").toDate();
			this.getModel("view").setProperty("/minDate", this._oInitView.minDate);
			this.getModel("view").setProperty("/maxDate", this._oInitView.maxDate);
		},

		_onRouteMatched: function(oEvent) {
			var oArgs, oView, oQuery;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oQuery = oArgs["?query"];

			if (oQuery) {
				if (oQuery.AUFNR) {
					oView.getModel("data").setProperty("/orderNumber", oQuery.AUFNR);
					this.byId("orderNumberInput").fireChange({
						value: oQuery.AUFNR
					});
				}
				if (oQuery.VORNR) {
					oView.getModel("data").setProperty("/operationNumber", oQuery.VORNR);
					this.byId("operationNumberInput").fireChange({
						value: oQuery.VORNR
					});
				}
			}
		},
		generateOperationTimeline: function(oStartDate, aInterruptions, oEndDate) {

			// example: valueColor="Good" value="60" displayValue="60min"

			return new Promise(function(resolve, reject) {
				// do a thing, possibly async, then…

				var aTimeLine = [],
					iDuration = 0,
					startMoment,
					endMoment;

				if (!oStartDate) {
					reject(new Error("No start date provided"));
				}

				if (!oEndDate) {
					oEndDate = new Date();
				}

				startMoment = moment(oStartDate);
				endMoment = moment(oEndDate);

				iDuration = endMoment - startMoment;

				if (!aInterruptions) {
					aTimeLine.push(new StackedBarMicroChartBar({
						valueColor: "Good",
						value: iDuration,
						displayValue: iDuration + " min"
					}));
				} else {
					var fnMicroChartBarFactory = function(oInterruption) {
						var length = oInterruption.STR_ENDE - oInterruption.STR_BEGINN;
						length = length / 3600;

						return new StackedBarMicroChartBar({
							valueColor: "Error",
							value: length,
							displayValue: length + " min"
						});

					};

					//Start -> 1st Interruption
					var iFirstLength = aInterruptions[0].STR_BEGINN - startMoment;
					aTimeLine.push(new StackedBarMicroChartBar({
						valueColor: "Good",
						value: iFirstLength,
						displayValue: iFirstLength + " min"
					}));

					//Interruptions
					aInterruptions = aInterruptions.map(fnMicroChartBarFactory);

					aTimeLine = aTimeLine.concat(aInterruptions);

					//last Interruption -> End
					var iLastLength = endMoment - aInterruptions[aInterruptions.length - 1].STR_ENDE;
					aTimeLine.push(new StackedBarMicroChartBar({
						valueColor: "Good",
						value: iLastLength,
						displayValue: iLastLength + " min"
					}));
				}

				resolve(aTimeLine);

			});
		}
	});
});