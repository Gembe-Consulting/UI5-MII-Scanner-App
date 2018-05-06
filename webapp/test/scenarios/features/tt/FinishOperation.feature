Feature: Finish Operation
	Users can finish a process order operation
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		  And I navigate to /VB
		
	Scenario: Should navigate to Finish Operation Page and see all UI elements
		Then I can see finishOperationPage in action.tt.FinishOperation view
		 And I can see orderNumberInput in action.tt.FinishOperation view
		 And I can see operationNumberInput in action.tt.FinishOperation view
		 And I can see dateTimeEntry in action.tt.FinishOperation view
		 And I can see clearFormButton in action.tt.FinishOperation view
		 And I can see cancelButton with text 'Abbrechen' in action.tt.FinishOperation view
		 And I can see finishOperationPageTitle with text 'Vorgang beenden' in action.tt.FinishOperation view
		 And I cannot see saveButton in action.tt.FinishOperation view
		 And I can see finishOperationPageIcon with src 'sap-icon://complete' in action.tt.FinishOperation view
		 And I can see finishOperationPageIcon with color '#05b074' in action.tt.FinishOperation view
		 And I can see finishOperationPageTitle in action.tt.FinishOperation view has css color '#05b074'
		Then on the Finish Operation Page: I should see the save button is disabled
		Then on the Finish Operation Page: I should see all input fields are initial
		Then on the Finish Operation Page: I should see data model and view model are initial
	
	Scenario: Should show order information if users enter valid order number
		When I enter '1092696' into orderNumberInput in action.tt.FinishOperation view
		 And I enter '10' into operationNumberInput in action.tt.FinishOperation view
		Then I can see processOrderFragmentOperationInfo with text 'Gestartet: Verpackung aus Silo' in action.tt.FinishOperation view
		 And I can see processOrderFragmentRessourceInfo with text '00253110 - Absackanlage Milchprodukte' in action.tt.FinishOperation view
		 And I can see processOrderFragmentStatusInfo with text 'Gestartet (0003)' in action.tt.FinishOperation view
		When I enter '1000001' into orderNumberInput in action.tt.FinishOperation view
		Then I cannot see processOrderInfo in action.tt.FinishOperation view
		 
	Scenario: Should validate user input and activate save button
		When I enter '1092696' into orderNumberInput in action.tt.FinishOperation view
		Then I cannot see saveButton in action.tt.FinishOperation view
		When I enter '10' into operationNumberInput in action.tt.FinishOperation view
		Then I can see saveButton in action.tt.FinishOperation view
		 And I can see orderNumberInput with valueState 'Success' in action.tt.FinishOperation view
		 And I can see operationNumberInput with valueState 'Success' in action.tt.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.FinishOperation view	 
		When I enter '' into dateTimeEntry in action.tt.FinishOperation view
		Then I cannot see saveButton in action.tt.FinishOperation view
		 And I can see dateTimeEntry with valueState 'None' in action.tt.FinishOperation view	 
		When I can enter a date 4 days and 0 minutes in the past into dateTimeEntry in action.tt.FinishOperation view
		Then I should see dateTimeEntry with date 4 days and 0 minutes in the past in action.tt.FinishOperation view
		Then I can see saveButton in action.tt.FinishOperation view
		
	Scenario: Should show error message if users enter invalid order number (not existing or wrong status)
		When I enter '1000001' into orderNumberInput in action.tt.FinishOperation view
		 And I enter '10' into operationNumberInput in action.tt.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1000001' nicht gefunden oder Vorgang '0010' nicht vorhanden.' in action.tt.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.FinishOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.FinishOperation view
		 And I cannot see saveButton in action.tt.FinishOperation view
		When I enter '1092696' into orderNumberInput in action.tt.FinishOperation view
		Then I can see orderNumberInput with valueState 'Success' in action.tt.FinishOperation view
		 And I can see saveButton in action.tt.FinishOperation view
		 And messageStripContainer in action.tt.FinishOperation view contains no content
		When I enter '1092694' into orderNumberInput in action.tt.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092694' kann nicht beendet werden. Vorgang hat den Status 'Abgeschlossen'.' in action.tt.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.FinishOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.FinishOperation view
		 And I cannot see saveButton in action.tt.FinishOperation view
		When I click on clearFormButton in action.tt.FinishOperation view
		 Then I cannot see saveButton in action.tt.FinishOperation view
		  And I can see orderNumberInput with valueState 'None' in action.tt.FinishOperation view	
		  And I can see dateTimeEntry with valueState 'None' in action.tt.FinishOperation view
		  And messageStripContainer in action.tt.FinishOperation view contains no content
		Then on the Finish Operation Page: I should see all input fields are initial
		Then on the Finish Operation Page: I should see data model and view model are initial

	Scenario: Should show error message if users enter order number that has been started after entry date
		When I enter '25.04.2018, 16:40:00' into dateTimeEntry in action.tt.FinishOperation view
		 And I enter '1092697' into orderNumberInput in action.tt.FinishOperation view
		 And I enter '10' into operationNumberInput in action.tt.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092697' wurde am 'Mittwoch, 25. April 2018 16:41' gestartet und kann daher nicht zum 'Mittwoch, 25. April 2018 16:40' beendet werden.' in action.tt.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Error' in action.tt.FinishOperation view
		 And I cannot see saveButton in action.tt.FinishOperation view
		When I enter '25.04.2018, 16:42:00' into dateTimeEntry in action.tt.FinishOperation view
		Then I can see saveButton in action.tt.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.FinishOperation view
		 And messageStripContainer in action.tt.FinishOperation view contains no content
		 
	Scenario: Should show error message if users enter order number that has an closed incident after entry date
		When I enter '26.04.2018, 16:40' into dateTimeEntry in action.tt.FinishOperation view
		 And I enter '1092698' into orderNumberInput in action.tt.FinishOperation view
		 And I enter '20' into operationNumberInput in action.tt.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0020' zu Auftrag '1092698' wurde am 'Donnerstag, 26. April 2018 16:41' aus einer Unterbrechung heraus fortgesetzt und kann daher nicht zum 'Donnerstag, 26. April 2018 16:40' beendet werden.' in action.tt.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Error' in action.tt.FinishOperation view
		 And I cannot see saveButton in action.tt.FinishOperation view
		When I enter '26.04.2018, 16:42' into dateTimeEntry in action.tt.FinishOperation view
		Then I can see saveButton in action.tt.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.FinishOperation view
		 And messageStripContainer in action.tt.FinishOperation view contains no content

	Scenario: Should send timeticket confirmation to SAP ERP
		When I enter '1092699' into orderNumberInput in action.tt.FinishOperation view
		 And I enter '1132' into operationNumberInput in action.tt.FinishOperation view
		When I click on saveButton in action.tt.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '1132' zu Auftrag '1092699' wurde erfolgreich beendet! Endezeitpunkt:' in action.tt.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.tt.FinishOperation view
		Then on the Finish Operation Page: I should see all input fields are initial
		Then on the Finish Operation Page: I should see data model and view model are initial