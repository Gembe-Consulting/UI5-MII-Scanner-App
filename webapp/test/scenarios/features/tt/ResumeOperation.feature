Feature: Resume Operation
	Users can Resume a process order operation
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		  And I navigate to /VF
		
	Scenario: Should navigate to Resume Operation Page and see all UI elements
		Then I can see resumeOperationPage in action.tt.ResumeOperation view
		 And I can see orderNumberInput in action.tt.ResumeOperation view
		 And I can see operationNumberInput in action.tt.ResumeOperation view
		 And I can see dateTimeEntry in action.tt.ResumeOperation view
		 And I can see clearFormButton in action.tt.ResumeOperation view
		 And I can see cancelButton with text 'Abbrechen' in action.tt.ResumeOperation view
		 And I can see resumeOperationPageTitle with text 'Vorgang fortsetzen' in action.tt.ResumeOperation view
		 And I cannot see saveButton in action.tt.ResumeOperation view
		 And I can see resumeOperationPageIcon with src 'sap-icon://restart' in action.tt.ResumeOperation view
		 And I can see resumeOperationPageIcon with color '#BB07FF' in action.tt.ResumeOperation view
		 And I can see resumeOperationPageTitle in action.tt.ResumeOperation view has css color '#BB07FF'
		Then on the Resume Operation Page: I should see the save button is disabled
		Then on the Resume Operation Page: I should see all input fields are initial
		Then on the Resume Operation Page: I should see data model and view model are initial
	
	Scenario: Should show order information if users enter valid order number
		When I enter '1092710' into orderNumberInput in action.tt.ResumeOperation view
		 And I enter '11' into operationNumberInput in action.tt.ResumeOperation view
		Then I can see processOrderFragmentOperationInfo with text 'Störung: Verpackung aus Silo' in action.tt.ResumeOperation view
		 And I can see processOrderFragmentRessourceInfo with text '00253110 - Absackanlage Milchprodukte' in action.tt.ResumeOperation view
		 And I can see processOrderFragmentStatusInfo with text 'Störung (0098)' in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0011' zu Auftrag '1092710' unterbrochen wegen 'P100: Aktuelle Elektrische Störung' angelegt am 'Donnerstag, 26. April 2018 16:00' von 'PHIGEM'.' in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Information' in action.tt.ResumeOperation view
		When I enter '1000001' into orderNumberInput in action.tt.ResumeOperation view
		Then I cannot see processOrderInfo in action.tt.ResumeOperation view
		When I click on clearFormButton in action.tt.ResumeOperation view
		Then I can see orderNumberInput with valueState 'None' in action.tt.ResumeOperation view
		 And I cannot see saveButton in action.tt.ResumeOperation view
		 And messageStripContainer in action.tt.ResumeOperation view contains no content
		Then on the Resume Operation Page: I should see all input fields are initial
		Then on the Resume Operation Page: I should see data model and view model are initial
		
	Scenario: Should validate user input and activate save button
		When I enter '1092710' into orderNumberInput in action.tt.ResumeOperation view
		Then I cannot see saveButton in action.tt.ResumeOperation view
		When I enter '11' into operationNumberInput in action.tt.ResumeOperation view
		Then I can see saveButton in action.tt.ResumeOperation view
		 And I can see orderNumberInput with valueState 'Success' in action.tt.ResumeOperation view
		 And I can see operationNumberInput with valueState 'Success' in action.tt.ResumeOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.ResumeOperation view
		When I enter '' into dateTimeEntry in action.tt.ResumeOperation view
		Then I cannot see saveButton in action.tt.ResumeOperation view
		 And I can see dateTimeEntry with valueState 'None' in action.tt.ResumeOperation view
#		When I enter '28.04.2018, 12:19:46' into dateTimeEntry in action.tt.ResumeOperation view
		When I can enter a date 1 days and 280 minutes in the past into dateTimeEntry in action.tt.ResumeOperation view
		Then I should see dateTimeEntry with date 1 days and 280 minutes in the past in action.tt.ResumeOperation view
		Then I can see saveButton in action.tt.ResumeOperation view
		When I enter '' into orderNumberInput in action.tt.ResumeOperation view
		Then I cannot see saveButton in action.tt.ResumeOperation view
		When I enter '1092710' into orderNumberInput in action.tt.ResumeOperation view
		Then I can see saveButton in action.tt.ResumeOperation view
		
	Scenario: Should show error message if users enter invalid order number (not existing or wrong status)
		When I enter '1000001' into orderNumberInput in action.tt.ResumeOperation view
		 And I enter '0011' into operationNumberInput in action.tt.ResumeOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1000001' nicht gefunden oder Vorgang '0011' nicht vorhanden.' in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.ResumeOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.ResumeOperation view
		 And I cannot see saveButton in action.tt.ResumeOperation view
		When I enter '1092710' into orderNumberInput in action.tt.ResumeOperation view
		Then I can see orderNumberInput with valueState 'Success' in action.tt.ResumeOperation view
		 And I can see saveButton in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Information' in action.tt.ResumeOperation view
		 And messageStripContainer in action.tt.ResumeOperation view contains 1 content
		When I enter '' into operationNumberInput in action.tt.ResumeOperation view
		 And I enter '1092694' into orderNumberInput in action.tt.ResumeOperation view
		 And I enter '0010' into operationNumberInput in action.tt.ResumeOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092694' kann nicht forgesetzt werden. Vorgang hat den Status 'Abgeschlossen'.' in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.ResumeOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.ResumeOperation view
		 And I cannot see saveButton in action.tt.ResumeOperation view

	Scenario: Should show error message if users enter order number with current interruption that has been started after entry date
		When I enter '26.04.2018, 15:59:00' into dateTimeEntry in action.tt.ResumeOperation view
		 And I enter '1092710' into orderNumberInput in action.tt.ResumeOperation view
		 And I enter '11' into operationNumberInput in action.tt.ResumeOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0011' zu Auftrag '1092710' wurde am 'Donnerstag, 26. April 2018 16:00' mit 'P100: Aktuelle Elektrische Störung' unterbrochen und kann daher nicht zum 'Donnerstag, 26. April 2018 15:59' fortgesetzt werden.' in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.ResumeOperation view
		 And I can see dateTimeEntry with valueState 'Error' in action.tt.ResumeOperation view
		 And I cannot see saveButton in action.tt.ResumeOperation view
		When I enter '26.04.2018, 16:01:00' into dateTimeEntry in action.tt.ResumeOperation view
		Then I can see saveButton in action.tt.ResumeOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0011' zu Auftrag '1092710' unterbrochen wegen 'P100: Aktuelle Elektrische Störung' angelegt am 'Donnerstag, 26. April 2018 16:00' von 'PHIGEM'.' in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Information' in action.tt.ResumeOperation view
		
	Scenario: Should send timeticket confirmation to SAP ERP
		When I enter '1092715' into orderNumberInput in action.tt.ResumeOperation view
		 And I enter '1002' into operationNumberInput in action.tt.ResumeOperation view
		When I click on saveButton in action.tt.ResumeOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '1002' zu Auftrag '1092715' wurde erfolgreich fortgesetzt! Fortsetzungszeitpunkt:' in action.tt.ResumeOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.tt.ResumeOperation view
		Then on the Resume Operation Page: I should see all input fields are initial
		Then on the Resume Operation Page: I should see data model and view model are initial