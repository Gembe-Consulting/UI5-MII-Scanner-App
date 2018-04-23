sap.ui.define([
	"com/mii/scanner/controller/action/ActionBaseController",
	"sap/suite/ui/microchart/StackedBarMicroChartBar",
	"com/mii/scanner/libs/momentjs/moment"
], function(ActionBaseController, StackedBarMicroChartBar, moment) {
	return ActionBaseController.extend("com.mii.scanner.controller.action.tt.BaseTTController", {

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

		onInit: function() {
			ActionBaseController.prototype.onInit.call(this); // DO NOT DELETE!

			this.getView().addEventDelegate({
				onBeforeShow: this._refreshDateValue
			}, this);

			this.getView().attachParseError(function() {
				this.updateViewControls(this.getModel("data").getData());
			}.bind(this));
			this.getView().attachValidationError(function() {
				this.updateViewControls(this.getModel("data").getData());
			}.bind(this));
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
		},

		updateViewControls: function(oData) {
			var oViewModel = this.getModel("view"),
				bOrderOperationValid = oViewModel.getProperty("/bOrderOperationValid"),
				bDateTimeEntryValid = oViewModel.getProperty("/bDateTimeEntryValid"),
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
			bReadyForPosting = bOrderOperationValid && bDateTimeEntryValid && bInputValuesComplete && bInputIsValid && bNoErrorMessagesActive;

			oViewModel.setProperty("/bValid", bReadyForPosting);
		},

		onOrderNumberInputChange: function(oEvent) {
			this.onOrderChange(oEvent);
		},

		onOperationNumberInputChange: function(oEvent) {
			this.onOrderChange(oEvent);
		},

		onDateTimeEntryChange: function(oEvent) {
			var oData = this.getModel("data").getData();
			this.removeAllUserMessages();
			this.updateViewControls(oData);
		},

		onReasonSelectionChange: function(oEvent) {
			var oData = this.getModel("data").getData();
			this.removeAllUserMessages();
			this.updateViewControls(oData);
		},

		_refreshDateValue: function() {
			var oDate = new Date();
			this.getModel("data").setProperty("/dateTimeValue", oDate);
			this._oInitData.dateTimeValue = oDate;
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
		}
	});
});