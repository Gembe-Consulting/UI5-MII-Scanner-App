Feature: Start Operation
	Users can start a process order operation
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		 When I navigate to /VS
		
	Scenario: Should navigate to Start Operation Page and see all UI elements
		Then I can see startOperationPage in action.StartOperation view
		 And I can see orderNumberInput in action.StartOperation view
		 And I can see operationNumberInput in action.StartOperation view
		 And I can see dateAndTimeSelection in action.StartOperation view
		 And I can see clearFormButton in action.StartOperation view
		 And I can see cancelButton with text 'Abbrechen' in action.StartOperation view
		 And I can see startOperationPageTitle with text 'Vorgang starten' in action.StartOperation view
		 And I cannot see saveButton in action.StartOperation view
		 And I can see startOperationPageIcon with src 'sap-icon://begin' in action.StartOperation view
		 And I can see startOperationPageIcon with color '#330066' in action.StartOperation view
		 And I can see startOperationPageTitle in action.StartOperation view has css color '#330066'
		Then on the Stock Transfer Page: I should see the save button is disabled
		Then on the Stock Transfer Page: I should see all input fields are initial
		Then on the Stock Transfer Page: I should see data model and view model are initial