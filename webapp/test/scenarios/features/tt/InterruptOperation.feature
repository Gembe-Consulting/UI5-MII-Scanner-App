Feature: Interrupt Operation
	Users can Interrupt a process order operation
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		  And I navigate to /VU
		
	Scenario: Should navigate to Interrupt Operation Page and see all UI elements
		Then I can see interruptOperationPage in action.tt.InterruptOperation view
		 And I can see orderNumberInput in action.tt.InterruptOperation view
		 And I can see operationNumberInput in action.tt.InterruptOperation view
		 And I can see dateTimeEntry in action.tt.InterruptOperation view
		 And I can see reasonSelection in action.tt.InterruptOperation view
		 And I can see userCommentTextArea in action.tt.InterruptOperation view
		 And I can see clearFormButton in action.tt.InterruptOperation view
		 And I can see cancelButton with text 'Abbrechen' in action.tt.InterruptOperation view
		 And I can see interruptOperationPageTitle with text 'Vorgang unterbrechen' in action.tt.InterruptOperation view
		 And I cannot see saveButton in action.tt.InterruptOperation view
		 And I can see interruptOperationPageIcon with src 'sap-icon://error' in action.tt.InterruptOperation view
		 And I can see interruptOperationPageIcon with color '#FFAC00' in action.tt.InterruptOperation view
		 And I can see interruptOperationPageTitle in action.tt.InterruptOperation view has css color '#FFAC00'
		Then on the Interrupt Operation Page: I should see the save button is disabled
		Then on the Interrupt Operation Page: I should see all input fields are initial
		Then on the Interrupt Operation Page: I should see data model and view model are initial
	
	Scenario: Should show order information if users enter valid order number
		When I enter '1092700' into orderNumberInput in action.tt.InterruptOperation view
		 And I enter '1' into operationNumberInput in action.tt.InterruptOperation view
		Then I can see processOrderFragmentOperationInfo with text 'Gestartet: Verpackung aus Silo' in action.tt.InterruptOperation view
		 And I can see processOrderFragmentRessourceInfo with text '00253110 - Absackanlage Milchprodukte' in action.tt.InterruptOperation view
		 And I can see processOrderFragmentStatusInfo with text 'Gestartet (0003)' in action.tt.InterruptOperation view
		When I enter '1000001' into orderNumberInput in action.tt.InterruptOperation view
		Then I cannot see processOrderInfo in action.tt.InterruptOperation view
		When I click on clearFormButton in action.tt.InterruptOperation view
		 Then I cannot see saveButton in action.tt.InterruptOperation view
		  And I can see orderNumberInput with valueState 'None' in action.tt.InterruptOperation view
		  And I can see dateTimeEntry with valueState 'None' in action.tt.InterruptOperation view
		  And messageStripContainer in action.tt.InterruptOperation view contains no content
		Then on the Interrupt Operation Page: I should see all input fields are initial
		Then on the Interrupt Operation Page: I should see data model and view model are initial
	
	Scenario: Should validate user input and activate save button
		When I enter '1092696' into orderNumberInput in action.tt.InterruptOperation view
		Then I cannot see saveButton in action.tt.InterruptOperation view
		When I enter '10' into operationNumberInput in action.tt.InterruptOperation view
		Then I cannot see saveButton in action.tt.InterruptOperation view
		When I press ARROW_DOWN + ALT at reasonSelection in action.tt.InterruptOperation view
		 And I click on first item of reasonSelection items in action.tt.InterruptOperation view
		Then I can see saveButton in action.tt.InterruptOperation view
		 And I can see reasonSelection with selectedKey 'P100' in action.tt.InterruptOperation view
		 And I can see reasonSelection with valueState 'Success' in action.tt.InterruptOperation view
		 And I can see orderNumberInput with valueState 'Success' in action.tt.InterruptOperation view
		 And I can see operationNumberInput with valueState 'Success' in action.tt.InterruptOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.InterruptOperation view	 
		When I enter '' into dateTimeEntry in action.tt.InterruptOperation view
		Then I cannot see saveButton in action.tt.InterruptOperation view
		 And I can see dateTimeEntry with valueState 'None' in action.tt.InterruptOperation view	 
		When I can enter a date 2 days and 180 minutes in the past into dateTimeEntry in action.tt.InterruptOperation view
		Then I should see dateTimeEntry with date 2 days and 180 minutes in the past in action.tt.InterruptOperation view
		Then I can see saveButton in action.tt.InterruptOperation view
		
	@wip
	Scenario: Should handle invalid order number or operation number
	@wip
	Scenario: Should handle invalid date time entry
	@wip
	Scenario: Should handle invalid reason selection
	
	Scenario: Should show error message if users enter invalid order number (not existing or wrong status)
		When I enter '1000001' into orderNumberInput in action.tt.InterruptOperation view
		 And I enter '0001' into operationNumberInput in action.tt.InterruptOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1000001' nicht gefunden oder Vorgang '0001' nicht vorhanden.' in action.tt.InterruptOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.InterruptOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.InterruptOperation view
		 And I cannot see saveButton in action.tt.InterruptOperation view
		When I enter '1092700' into orderNumberInput in action.tt.InterruptOperation view
		Then I can see orderNumberInput with valueState 'Success' in action.tt.InterruptOperation view
		 And messageStripContainer in action.tt.InterruptOperation view contains no content
		When I press ARROW_DOWN + ALT at reasonSelection in action.tt.InterruptOperation view
		 And I click on first item of reasonSelection items in action.tt.InterruptOperation view
		Then I can see saveButton in action.tt.InterruptOperation view
		When I enter '1092694' into orderNumberInput in action.tt.InterruptOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1092694' nicht gefunden oder Vorgang '0001' nicht vorhanden.' in action.tt.InterruptOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.InterruptOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.InterruptOperation view
		 And I cannot see saveButton in action.tt.InterruptOperation view	
		When I enter '0010' into operationNumberInput in action.tt.InterruptOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092694' kann nicht unterbrochen werden. Vorgang hat den Status 'Abgeschlossen'.' in action.tt.InterruptOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.InterruptOperation view
		 And I can see orderNumberInput with valueState 'Error' in action.tt.InterruptOperation view
		 And I cannot see saveButton in action.tt.InterruptOperation view
		 
#Change ISTSTART for 1092697-0010 in GetOrderOperationQry.json || new Date(yyyy, mm-1, dd, 02, 41, 0, 0).getTime(); --> 1526604060000
	Scenario: Should show error message if users enter order number that has been started after entry date
#Change to current date:
	   Given I ignore the min date constraint in action.tt.InterruptOperation view
		When I enter '18.05.2018, 00:40:00' into dateTimeEntry in action.tt.InterruptOperation view
		 And I enter '1092697' into orderNumberInput in action.tt.InterruptOperation view
		 And I enter '10' into operationNumberInput in action.tt.InterruptOperation view
#Change ISTSTART and current date
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0010' zu Auftrag '1092697' wurde am 'Freitag, 18. Mai 2018 00:41' gestartet und kann daher nicht zum 'Freitag, 18. Mai 2018 00:40' unterbrochen werden.' in action.tt.InterruptOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.InterruptOperation view
		 And I can see dateTimeEntry with valueState 'Error' in action.tt.InterruptOperation view
		 And I cannot see saveButton in action.tt.InterruptOperation view
		When I can enter a date 0 days and 0 minutes in the past into dateTimeEntry in action.tt.InterruptOperation view
		Then I should see dateTimeEntry with date 0 days and 0 minutes in the past in action.tt.InterruptOperation view
		 And I press ARROW_DOWN + ALT at reasonSelection in action.tt.InterruptOperation view
		 And I click on first item of reasonSelection items in action.tt.InterruptOperation view
		Then I can see saveButton in action.tt.InterruptOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.InterruptOperation view
		 And messageStripContainer in action.tt.InterruptOperation view contains no content
		 
#Change STR_ENDE for 1092698-0020 in GetOrderIncidentsQry.json|| new Date(yyyy, mm-1, dd, 02, 41, 0, 0).getTime(); --> 1526604060000
	Scenario: Should show error message if users enter order number that has an closed incident after entry date
	   Given I ignore the min date constraint in action.tt.InterruptOperation view
		When I enter '18.05.2018, 00:40' into dateTimeEntry in action.tt.InterruptOperation view
		 And I enter '1092698' into orderNumberInput in action.tt.InterruptOperation view
		 And I enter '20' into operationNumberInput in action.tt.InterruptOperation view
#Change STR_ENDE and current date
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '0020' zu Auftrag '1092698' wurde am 'Freitag, 18. Mai 2018 00:41' aus einer Unterbrechung heraus fortgesetzt und kann daher nicht zum 'Freitag, 18. Mai 2018 00:40' unterbrochen werden.' in action.tt.InterruptOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Error' in action.tt.InterruptOperation view
		 And I can see dateTimeEntry with valueState 'Error' in action.tt.InterruptOperation view
		 And I cannot see saveButton in action.tt.InterruptOperation view
		When I can enter a date 0 days and 0 minutes in the past into dateTimeEntry in action.tt.InterruptOperation view
		Then I should see dateTimeEntry with date 0 days and 0 minutes in the past in action.tt.InterruptOperation view
		 And I press ARROW_DOWN + ALT at reasonSelection in action.tt.InterruptOperation view
		 And I click on last item of reasonSelection items in action.tt.InterruptOperation view
		Then I can see saveButton in action.tt.InterruptOperation view
		 And I can see dateTimeEntry with valueState 'Success' in action.tt.InterruptOperation view
		 And messageStripContainer in action.tt.InterruptOperation view contains no content

	Scenario: Should send timeticket confirmation to SAP ERP
		When I enter '1092699' into orderNumberInput in action.tt.InterruptOperation view
		 And I enter '1132' into operationNumberInput in action.tt.InterruptOperation view
		 And I press ARROW_DOWN + ALT at reasonSelection in action.tt.InterruptOperation view
		 And I click on last item of reasonSelection items in action.tt.InterruptOperation view
		When I click on saveButton in action.tt.InterruptOperation view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Vorgang '1132' zu Auftrag '1092699' wurde erfolgreich unterbrochen! Unterbrechungszeitpunkt:' in action.tt.InterruptOperation view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.tt.InterruptOperation view