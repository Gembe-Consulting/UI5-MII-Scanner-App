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
		Then I can see unitOfMeasureInput with editable being 'false' in action.RollerConveyor view
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
	
	@wip 
	@emptyLE
	@currentUnit
	Scenario: Should validate empty storage unit number and check completeness
		When I enter '1' into storageUnitInput in action.RollerConveyor view
		Then I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see quantityInput with value '' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'true' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with value 'XX' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with editable being 'false' in action.RollerConveyor view
		 And I cannot see saveButton in action.RollerConveyor view
		When I enter 'Rolltor' into storageBinSelection in action.RollerConveyor view
		Then I can see saveButton in action.RollerConveyor view
	
	@wip 
	@fullLE
	@currentUnit
	Scenario: Should validate full storage unit number and check completeness
		When I enter '2' into storageUnitInput in action.RollerConveyor view
		Then I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see quantityInput with value '1,2' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'false' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with value 'XY' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with editable being 'false' in action.RollerConveyor view
		 And I cannot see saveButton in action.RollerConveyor view
		When I enter 'Stapler' into storageBinSelection in action.RollerConveyor view
		Then I can see saveButton in action.RollerConveyor view
	
	@wip
	@lastUnit
	Scenario: Should display info message if last storage unit has been entered
		When I enter '90000000000000000000' into storageUnitInput in action.RollerConveyor view
		Then I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see messageStrip with text 'Letzte Palette' in action.RollerConveyor view
		 And I can see messageStrip with type 'Information' in action.StockTransfer view
		 
	@wip
	@lastUnit @emptyLE 
	Scenario: When entering last unit, you should not be able to select Rolltor or Stapler, only Beumer and Palettierer and you should be able to enter quantity and unit
		When I enter '90000000000000000000' into storageUnitInput in action.RollerConveyor view
		Then I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see quantityInput with value '' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'true' in action.RollerConveyor view
		 And I can see unitOfMeasure with editable being 'true' in action.RollerConveyor view
		 And storageBinSelection in action.RollerConveyor view contains 2 items
		When I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on first item of storageBinSelection items in action.RollerConveyor view
		Then I can see storageBinSelection with selectedKey 'BEUM' in action.RollerConveyor view
		 And I can see storageBinSelection with valueState 'Success' in action.RollerConveyor view
		When I click on last item of storageBinSelection items in action.RollerConveyor view
		Then I can see storageBinSelection with selectedKey 'PALE' in action.RollerConveyor view
		 And I can see storageBinSelection with valueState 'Success' in action.RollerConveyor view
		 
	@wip
	@lastUnit @emptyLE @Beumer
	Scenario: When entering last unit, and when selecting Beumer, then you should find process order, and then post 555, and then post 999
		When I enter '90000000000000000000' into storageUnitInput in action.RollerConveyor view
		 And I enter '100,123' into quantityInput in action.RollerConveyor view
		 And I enter 'KG' into unitOfMeasure in action.RollerConveyor view
		 And I enter 'BEUM' into storageBinSelection in action.RollerConveyor view
		 And I press 'ENTER' at storageBinSelection in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see messageStrip with text 'Letzte Palette an Beumer\nProzessauftrag 4711\nSpezial-Wareneingang mit pseudo BwA 555\nSpezial-Umbuchung mit pseudo BwA 999' in action.RollerConveyor view
		 And I can see messageStrip with type 'Success' in action.RollerConveyor view

	@wip
	@lastUnit @emptyLE @Palettierer 
	Scenario: When entering last unit, and when selecting Palettierer, then you should find process order, and then post 555, and then post 999
		When I enter '90000000000000000000' into storageUnitInput in action.RollerConveyor view
		 And I enter '321,456' into quantityInput in action.RollerConveyor view
		 And I enter 'KG' into unitOfMeasure in action.RollerConveyor view
		 And I enter 'PALE' into storageBinSelection in action.RollerConveyor view
		 And I press 'ENTER' at storageBinSelection in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see messageStrip with text 'Letzte Palette an Palettierer\nProzessauftrag 4712\nSpezial-Wareneingang mit pseudo BwA 555\nSpezial-Umbuchung mit pseudo BwA 999' in action.RollerConveyor view
		 And I can see messageStrip with type 'Success' in action.RollerConveyor view
		 
	@wip
	@currentUnit @emptyLE
	Scenario: When entering current unit with stock quantity = 0 (empty), then you should post 101, then you should post 999
		When I enter '1' into storageUnitInput in action.RollerConveyor view
		 And I can see quantityInput with value '' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'true' in action.RollerConveyor view
		 And I can see unitOfMeasure with editable being 'false' in action.RollerConveyor view
		 And I enter 'ROLLENBAHN' into storageBinSelection in action.RollerConveyor view
		 And I press 'ENTER' at storageBinSelection in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see messageStrip with text 'Laufende Palette an Rollenbahn\nProzessauftrag 1000001\Normal-Wareneingang mit echt BwA 101\nSpezial-Umbuchung mit pseudo BwA 999' in action.RollerConveyor view
		 And I can see messageStrip with type 'Success' in action.RollerConveyor view
		 
	@wip
	@currentUnit @fullLE
	Scenario: When entering current unit with stock quantity > 0 (full), then you should post 999
		When I enter '2' into storageUnitInput in action.RollerConveyor view
		 And I can see quantityInput with value '987,456' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'false' in action.RollerConveyor view
		 And I can see unitOfMeasure with editable being 'false' in action.RollerConveyor view
		 And I enter 'STAPLER' into storageBinSelection in action.RollerConveyor view
		 And I press 'ENTER' at storageBinSelection in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see messageStrip with text 'Laufende Palette an Stapler\nProzessauftrag 2000002\nSpezial-Umbuchung mit pseudo BwA 999' in action.RollerConveyor view
		 And I can see messageStrip with type 'Success' in action.RollerConveyor view
