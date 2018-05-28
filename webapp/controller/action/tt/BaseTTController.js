sap.ui.define([
	"jquery.sap.global",
	"com/mii/scanner/controller/action/ActionBaseController",
	"sap/m/MessageBox",
	"sap/suite/ui/microchart/StackedBarMicroChartBar",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(jQuery, ActionBaseController, MessageBox, StackedBarMicroChartBar, sapType, formatter) {
	"use strict";
	/* global moment:true */
	
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
			maxDate: null,
			userCommentEditIcon: "sap-icon://response",
			userCommentEditable: false
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
				fnCleanUp,
				fnBuildMicroChart;

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
					aRows = oData.d.results[0].Rowset.results[0].Row.results,
					iExactlyOne = 1;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === iExactlyOne) {
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

			fnCleanUp = function(oData) {
				this.hideControlBusyIndicator(oOrderNumberInput);
				this.hideControlBusyIndicator(oOperationNumberInput);
				this.updateViewControls(this.getModel("data").getData());

				return oData;
			};

			fnBuildMicroChart = function(oData) {
				if(!sap.ui.Device.system.desktop){
					return Promise.resolve();
				}
				
				var oChart = this.byId("processOrderChart");
				
				if (oData && oChart) {
					var aInterruptions = oData.d.results["0"].Rowset.results["0"].Row.results,
						oStartDate = this.getModel("data").getProperty("/ISTSTART"),
						oEndDate = this.getModel("data").getProperty("/ISTENDE");

					this.generateOperationTimeline(oStartDate, aInterruptions, oEndDate)
						.then(function(aBars) {
							oChart.removeAllBars();
							aBars.forEach(function(element) {
								oChart.addBar(element);
							});
						}.bind(this));
				}else{
						this.byId("processOrderChart").removeAllBars();
				}
				
				return {};
			};

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this.requestOrderOperationInfoService(sOrderNumber, sOperationNumber)
				.then(fnResolveOrderService.bind(this))
				.then(this.requestOrderOperationIncidentsService.bind(this))
				.then(fnResolveIncidentService.bind(this))
				.catch(fnReject.bind(this))
				.then(fnCleanUp.bind(this))
				.then(fnBuildMicroChart.bind(this));
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
			var minMoment = moment(this._oInitView.minDate),
				maxMoment = moment();

			if (oDateTimeEntryMoment.isBefore(minMoment, "day")) {
				oDateTimeEntryControl.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Eingabezeitpunkt ist zu klein. Eingabe nur ab '" + minMoment.format("LLL") + "' möglich.");
				
				return false;
				
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
				bValid = oEvent.getParameter("valid"),
				oDateTimeFormat = oSource._getFormatInstance();

			oSource.setValueState(sap.ui.core.ValueState.None);
			this.removeAllUserMessages();

			if (!bValid) {
				oSource.setValue(oDateTimeFormat.format(this._oLastValidDate || new Date()));
				oSource.setValueState(sap.ui.core.ValueState.Warning).setValueStateText("Eingabezeitpunkt '" + oEvent.getParameter("value") + "' ungültig. Eingabe wurde zurückgesetzt.");
				this.getModel("view").setProperty("/bValid", false);
			} else {
				this._oLastValidDate = oSource.getDateValue();
				this.updateViewControls(oData);
			}

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

		appendSignAndDateToComment: function(sComment) {
			return sComment ? sComment + "\n--" + this.getModel("user").getProperty("/USERLOGIN") + ", " + moment().format('LLL') : sComment;
		},

		generateOperationTimeline: function(oStartDate, aInterruptions, oEndDate) {

			// example: valueColor="Good" value="60" displayValue="60min"

			return new Promise(function(resolve, reject) {
				// do a thing, possibly async, then…

				var aTimeLine = [],
					sDurationFormatPattern = "d [T] h [S] m [M]",
					startMoment,
					endMoment,
					iEmpty = 0,
					iOne = 1;

				if (!oStartDate) {
					reject(new Error("No start date provided"));
				}

				if (!oEndDate) {
					oEndDate = new Date();
				}

				startMoment = moment(oStartDate);
				endMoment = moment(oEndDate);

				if (!aInterruptions) {
					var iDuration = endMoment - startMoment,
						MS_TO_MIN = 3600;
					
					iDuration = iDuration / MS_TO_MIN; //ms -> min
					aTimeLine.push(new StackedBarMicroChartBar({
						valueColor: "Good",
						value: iDuration,
						displayValue: moment.duration(iDuration).format(sDurationFormatPattern)
					}));
				} else {

					var fnMicroChartBarFactory = function(oInterruption, index, interruptions) {
						var oBar,
							startOfInterruption = moment(oInterruption.STR_BEGINN),
							endOfInterruption = moment(oInterruption.STR_ENDE).isValid() ? moment(oInterruption.STR_ENDE) : moment(),
							length = endOfInterruption - startOfInterruption,
							oNextBar,
							iOne = 1;

						oBar = new StackedBarMicroChartBar({
							valueColor: "Error",
							value: length,
							displayValue: moment.duration(length).format(sDurationFormatPattern)
						}).setTooltip(startOfInterruption.format("LLL") + " > " + endOfInterruption.format("LLL") + " -- " + oInterruption.STRCODE + ": " + oInterruption.STR_TXT + " [" + moment.duration(length).format(sDurationFormatPattern) + "]");

						var oNextIntervall = interruptions[index + iOne];

						if (oNextIntervall) {
							var endOfNextRunning = moment(oNextIntervall.STR_BEGINN);
							var rest = endOfNextRunning - endOfInterruption;
							oNextBar = new StackedBarMicroChartBar({
								valueColor: "Good",
								value: length,
								displayValue: moment.duration(rest).format(sDurationFormatPattern)
							}).setTooltip(endOfInterruption.format("LLL") + " > " + endOfNextRunning.format("LLL") + " -- In Betrieb [" + moment.duration(rest).format(sDurationFormatPattern) + "]");

							return [oBar, oNextBar];
						}

						return [oBar];

					};

					//Start -> 1st Interruption
					var firstInterruptionStart = moment(aInterruptions[0].STR_BEGINN);
					var iFirstLength = firstInterruptionStart - startMoment;
					aTimeLine.push(new StackedBarMicroChartBar({
						valueColor: "Good",
						value: iFirstLength,
						displayValue: moment.duration(iFirstLength).format(sDurationFormatPattern)
					}).setTooltip(startMoment.format("LLL") + " > " + firstInterruptionStart.format("LLL") + " -- In Betrieb [" + moment.duration(iFirstLength).format(sDurationFormatPattern) + "]"));

					//Interruptions
					/*global _*/
					aTimeLine = aTimeLine.concat(_.flattenDeep(aInterruptions.map(fnMicroChartBarFactory)));
					
					//last Interruption -> End
					var lastInterruptionEnd = moment(aInterruptions[aInterruptions.length - iOne].STR_ENDE).isValid() ? moment(aInterruptions[aInterruptions.length - iOne].STR_ENDE) : moment();
					var iLastLength = endMoment - lastInterruptionEnd;
					if (iLastLength > iEmpty) {
						aTimeLine.push(new StackedBarMicroChartBar({
							valueColor: "Good",
							value: iLastLength,
							displayValue: moment.duration(iLastLength).format(sDurationFormatPattern)
						}).setTooltip(lastInterruptionEnd.format("LLL") + " > " + endMoment.format("LLL") + " -- In Betrieb [" + moment.duration(iLastLength).format(sDurationFormatPattern) + "]"));
					}
				}

				resolve(aTimeLine);

			});
		}
	});
});