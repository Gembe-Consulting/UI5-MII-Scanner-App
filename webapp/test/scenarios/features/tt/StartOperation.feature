Feature: Start Operation
	Users can start a process order operation
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		  And I navigate to /VS
	
	Scenario: Should navigate to Start Operation Page and see all UI elements
		Then I can see startOperationPage in action.tt.StartOperation view
		 And I can see orderNumberInput in action.tt.StartOperation view
		 And I can see operationNumberInput in action.tt.StartOperation view
		 And I can see dateTimeEntry in action.tt.StartOperation view
		 And I can see clearFormButton in action.tt.StartOperation view
		 And I can see cancelButton with text 'Abbrechen' in action.tt.StartOperation view
		 And I can see startOperationPageTitle with text 'Vorgang starten' in action.tt.StartOperation view
		 And I cannot see saveButton in action.tt.StartOperation view
		 And I can see startOperationPageIcon with src 'sap-icon://begin' in action.tt.StartOperation view
		 And I can see startOperationPageIcon with color '#330066' in action.tt.StartOperation view
		 And I can see startOperationPageTitle in action.tt.StartOperation view has css color '#330066'
		Then on the Start Operation Page: I should see the save button is disabled
		Then on the Start Operation Page: I should see all input fields are initial
		Then on the Start Operation Page: I should see data model and view model are initial
	
	Scenario: Should show order information if users enter valid order number
		When I enter '1092695' into orderNumberInput in action.tt.StartOperation view
		 And I enter '10' into operationNumberInput in action.tt.StartOperation view
		Then I can see processOrderFragmentOperationInfo with text 'Freigegeben: Verpackung aus Silo' in action.tt.StartOperation view
		 And I can see processOrderFragmentRessourceInfo with text '00253110 - Absackanlage Milchprodukte' in action.tt.StartOperation view
		 And I can see processOrderFragmentStatusInfo with text 'Freigegeben (0002)' in action.tt.StartOperation view
		When I enter '1000001' into orderNumberInput in action.tt.StartOperation view
		Then I cannot see processOrderInfo in action.tt.StartOperation view
		
	Scenario: Should validate user input and activate save button
		When I enter '1092695' into orderNumberInput in action.tt.StartOperation view
		Then I cannot see saveButton in action.tt.StartOperation view
		When I enter '10' into operationNumberInput in action.tt.StartOperation view
		Then I can see saveButton in action.tt.StartOperation view
		 And I can see orderNumberInput with valueState 'Success' in action.tt.StartOperation view
		 And I can see operationNumberInput with valueState 'Success' in action.tt.StartOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.StartOperation view
		When I enter '' into dateTimeEntry in action.tt.StartOperation view
		Then I cannot see saveButton in action.tt.StartOperation view
		 And I can see dateTimeEntry with valueState 'None' in action.tt.StartOperation view
		When I can enter a date 1 days and 0 minutes in the past into dateTimeEntry in action.tt.StartOperation view
		Then I should see dateTimeEntry with date 1 days and 0 minutes in the past in action.tt.StartOperation view
		Then I can see saveButton in action.tt.StartOperation view
	
	Scenario: Should show error message if users enter invalid order number
		When I enter '1000001' into orderNumberInput in action.tt.StartOperation view
		 And I enter '10' into operationNumberInput in action.tt.StartOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1000001' nicht gefunden oder Vorgang '0010' nicht vorhanden.' in action.tt.StartOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.StartOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.StartOperation view
		 And I cannot see saveButton in action.tt.StartOperation view
		When I enter '1092695' into orderNumberInput in action.tt.StartOperation view
		Then I can see orderNumberInput with valueState 'Success' in action.tt.StartOperation view
		 And I can see saveButton in action.tt.StartOperation view
		 And messageStripContainer in action.tt.StartOperation view contains no content
		When I enter '1092694' into orderNumberInput in action.tt.StartOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092694' kann nicht gestartet werden. Vorgang hat den Status 'Abgeschlossen'.' in action.tt.StartOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.StartOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.StartOperation view
		 And I cannot see saveButton in action.tt.StartOperation view
		When I click on clearFormButton in action.tt.StartOperation view
		 Then I cannot see saveButton in action.tt.StartOperation view
		  And I can see orderNumberInput with valueState 'None' in action.tt.StartOperation view
		  And I can see dateTimeEntry with valueState 'None' in action.tt.StartOperation view
		  And messageStripContainer in action.tt.StartOperation view contains no content
		Then on the Start Operation Page: I should see all input fields are initial
		Then on the Start Operation Page: I should see data model and view model are initial

	Scenario: Should send timeticket confirmation to SAP ERP
		When I enter '1092695' into orderNumberInput in action.tt.StartOperation view
		 And I enter '10' into operationNumberInput in action.tt.StartOperation view
		When I can enter a date 1 days and 180 minutes in the past into dateTimeEntry in action.tt.StartOperation view
		Then I should see dateTimeEntry with date 1 days and 180 minutes in the past in action.tt.StartOperation view
		When I click on saveButton in action.tt.StartOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092695' wurde erfolgreich gestartet! Startzeitpunkt:' in action.tt.StartOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.tt.StartOperation view
		Then on the Start Operation Page: I should see all input fields are initial
		Then on the Start Operation Page: I should see data model and view model are initial