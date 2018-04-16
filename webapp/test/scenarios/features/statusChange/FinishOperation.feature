Feature: Finish Operation
	Users can finish a process order operation
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		  And I navigate to /VB
		
	Scenario: Should navigate to Finish Operation Page and see all UI elements
		Then I can see finishOperationPage in action.FinishOperation view
		 And I can see orderNumberInput in action.FinishOperation view
		 And I can see operationNumberInput in action.FinishOperation view
		 And I can see dateTimeEntry in action.FinishOperation view
		 And I can see clearFormButton in action.FinishOperation view
		 And I can see cancelButton with text 'Abbrechen' in action.FinishOperation view
		 And I can see finishOperationPageTitle with text 'Vorgang beenden' in action.FinishOperation view
		 And I cannot see saveButton in action.FinishOperation view
		 And I can see finishOperationPageIcon with src 'sap-icon://complete' in action.FinishOperation view
		 And I can see finishOperationPageIcon with color '#05b074' in action.FinishOperation view
		 And I can see finishOperationPageTitle in action.FinishOperation view has css color '#05b074'
		Then on the Finish Operation Page: I should see the save button is disabled
		Then on the Finish Operation Page: I should see all input fields are initial
		Then on the Finish Operation Page: I should see data model and view model are initial
	
	Scenario: Should show order information if users enter valid order number
		When I enter '1092696' into orderNumberInput in action.FinishOperation view
		 And I enter '10' into operationNumberInput in action.FinishOperation view
		Then I can see processOrderFragmentOperationInfo with text 'Gestartet: Verpackung aus Silo' in action.FinishOperation view
		 And I can see processOrderFragmentRessourceInfo with text '00253110 - Absackanlage Milchprodukte' in action.FinishOperation view
		 And I can see processOrderFragmentStatusInfo with text 'Gestartet (0003)' in action.FinishOperation view
		When I enter '1000001' into orderNumberInput in action.FinishOperation view
		Then I cannot see processOrderInfo in action.FinishOperation view
	
	Scenario: Should show error message if users enter invalid order number (not existing or wrong status)
		When I enter '1000001' into orderNumberInput in action.FinishOperation view
		 And I enter '10' into operationNumberInput in action.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1000001' nicht gefunden oder Vorgang '0010' nicht vorhanden.' in action.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.FinishOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.FinishOperation view
		 And I cannot see saveButton in action.FinishOperation view
		When I enter '1092696' into orderNumberInput in action.FinishOperation view
		Then I can see orderNumberInput with valueState 'Success' in action.FinishOperation view
		 And I can see saveButton in action.FinishOperation view
		 And messageStripContainer in action.FinishOperation view contains no content
		When I enter '1092694' into orderNumberInput in action.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092694' kann nicht beendet werden. Vorgang hat den Status 'Abgeschlossen'.' in action.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.FinishOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.FinishOperation view
		 And I cannot see saveButton in action.FinishOperation view
		When I click on clearFormButton in action.FinishOperation view
		 Then I can see orderNumberInput with valueState 'None' in action.FinishOperation view
		  And I cannot see saveButton in action.FinishOperation view
		  And messageStripContainer in action.FinishOperation view contains no content
		Then on the Finish Operation Page: I should see all input fields are initial
		Then on the Finish Operation Page: I should see data model and view model are initial

	Scenario: Should show error message if users enter order number that has been started after entry date
		When I enter '18.01.1970, 10:24:56' into dateTimeEntry in action.FinishOperation view
		 And I enter '1092697' into orderNumberInput in action.FinishOperation view
		 And I enter '10' into operationNumberInput in action.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092697' wurde am 'Sonntag, 18. Januar 1970 16:16' gestartet und kann daher nicht zum 'Sonntag, 18. Januar 1970 10:24' beendet werden.' in action.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Error' in action.FinishOperation view
		 And I cannot see saveButton in action.FinishOperation view
		When I enter '18.01.70, 16:20' into dateTimeEntry in action.FinishOperation view
		Then I can see saveButton in action.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.FinishOperation view
		 And messageStripContainer in action.FinishOperation view contains no content
		 
	Scenario: Should show error message if users enter order number that has an closed incident after entry date
		When I enter '01.01.70, 03:00' into dateTimeEntry in action.FinishOperation view
		 And I enter '1092698' into orderNumberInput in action.FinishOperation view
		 And I enter '20' into operationNumberInput in action.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0020' zu Auftrag '1092698' wurde am 'Donnerstag, 1. Januar 1970 03:35' aus einer Störung heraus fortgesetzt und kann daher nicht zum 'Donnerstag, 1. Januar 1970 03:00' beendet werden.' in action.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Error' in action.FinishOperation view
		 And I cannot see saveButton in action.FinishOperation view
		When I enter '02.04.2018, 00:00:00' into dateTimeEntry in action.FinishOperation view
		Then I can see saveButton in action.FinishOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.FinishOperation view
		 And messageStripContainer in action.FinishOperation view contains no content
		 
	Scenario: Should validate user input and activate save button
		When I enter '1092696' into orderNumberInput in action.FinishOperation view
		Then I cannot see saveButton in action.FinishOperation view
		When I enter '10' into operationNumberInput in action.FinishOperation view
		Then I can see saveButton in action.FinishOperation view
		When I enter '' into dateTimeEntry in action.FinishOperation view
		Then I cannot see saveButton in action.FinishOperation view
		When I enter '07.04.2018, 12:19:46' into dateTimeEntry in action.FinishOperation view
		Then I can see saveButton in action.FinishOperation view

	Scenario: Should send timeticket confirmation to SAP ERP
		When I enter '1092699' into orderNumberInput in action.FinishOperation view
		 And I enter '1132' into operationNumberInput in action.FinishOperation view
		 And I enter '07.04.2018, 12:19:46' into dateTimeEntry in action.FinishOperation view
		When I click on saveButton in action.FinishOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '1132' zu Auftrag '1092699' wurde erfolgreich beendet! Endezeitpunkt: Samstag, 07. April 2018 12:19' in action.FinishOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.FinishOperation view