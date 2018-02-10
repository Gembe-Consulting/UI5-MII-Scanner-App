Feature: Creating a stock transfer at Roller Conveyor
	Users can....
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		When I navigate to "Start/Materialbewegung/ROL"
		
	Scenario: Should navigate to Roller Conveyor Page and see all UI elements with initial data
		Then I can see rollerConveyorPage in action.RollerConveyor view
		Then I can see storageUnitInput with editable being 'true' in action.RollerConveyor view
		Then I can see storageUnitInput with value '' in action.RollerConveyor view
		Then I can see quantityInput with value '' in action.RollerConveyor view
		Then I can see clearQuantityInputIcon in action.RollerConveyor view
		Then I can see unitOfMeasureInput in action.RollerConveyor view
		Then I can see storageBinSelection with editable being 'true' in action.RollerConveyor view
		Then storageBinSelection in action.RollerConveyor view contains 4 items
		Then I can see stretcherActiveSwitch with state being 'false' in action.RollerConveyor view
		Then I can see clearFormButton in action.RollerConveyor view
		Then I can see cancelButton with text 'Abbrechen' in action.RollerConveyor view
		Then I can see rollerConveyorPageIcon with src 'sap-icon://instance' in action.RollerConveyor view
		Then I can see rollerConveyorPageIcon with color '#05B074' in action.RollerConveyor view
		Then I can see rollerConveyorPageIcon2 with src 'sap-icon://process' in action.RollerConveyor view
		Then I can see rollerConveyorPageIcon2 with color '#05B074' in action.RollerConveyor view
		Then I can see rollerConveyorPageTitle in action.RollerConveyor view has css color '#05B074'
		Then I cannot see saveButton in action.RollerConveyor view
		Then on the Roller Conveyor Page: I should see all input fields are initial
		Then on the Roller Conveyor Page: I should see data model and view model are initial