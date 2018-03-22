Feature: Roller Conveyor
	Users can....
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		 When I navigate to /ROL
		
	Scenario: Should navigate to Roller Conveyor Page and see all UI elements with initial data
		Then I can see rollerConveyorPage in action.RollerConveyor view
		Then I can see storageUnitInput with editable being 'true' in action.RollerConveyor view
		Then I can see quantityInput with editable being 'true' in action.RollerConveyor view
		Then I can see clearQuantityInputIcon in action.RollerConveyor view
		Then I can see unitOfMeasureInput with editable being 'false' in action.RollerConveyor view
		Then I can see storageBinSelection with editable being 'true' in action.RollerConveyor view
		Then storageBinSelection in action.RollerConveyor view contains 4 items
		Then I can see stretcherActiveSwitch with state being 'true' in action.RollerConveyor view
		Then I can see clearFormButton in action.RollerConveyor view
		Then I can see cancelButton with text 'Abbrechen' in action.RollerConveyor view
		Then I can see rollerConveyorPageIcon with src 'sap-icon://instance' in action.RollerConveyor view
		Then I can see rollerConveyorPageIcon with color '#05B074' in action.RollerConveyor view
		Then I can see rollerConveyorPageIcon2 with src 'sap-icon://process' in action.RollerConveyor view
		Then I can see rollerConveyorPageIcon2 with color '#05B074' in action.RollerConveyor view
		Then I can see rollerConveyorPageTitle in action.RollerConveyor view has css color '#05B074'
		Then I cannot see saveButton in action.RollerConveyor view
		Then on the Roller Conveyor Page: I should see the save button is disabled
		Then on the Roller Conveyor Page: I should see all input fields are initial
		Then on the Roller Conveyor Page: I should see data model and view model are initial
	
	@emptyLE
	@currentUnit
	Scenario: Should validate empty storage unit number and check completeness
		When I enter '00000000109330000015' into storageUnitInput in action.RollerConveyor view
		Then on the Roller Conveyor Page: I should see storageBinSelection contains 2 enabled items
		Then I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see quantityInput with value '' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'true' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with value 'KG' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with editable being 'false' in action.RollerConveyor view
		 And I cannot see saveButton in action.RollerConveyor view
		When I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on first item of storageBinSelection items in action.RollerConveyor view
		Then I can see storageBinSelection with valueState 'Success' in action.RollerConveyor view
		Then I cannot see saveButton in action.RollerConveyor view
		When I enter '100,123' into quantityInput in action.RollerConveyor view
		Then I can see saveButton in action.RollerConveyor view
	
	@fullLE
	@currentUnit
	Scenario: Should validate full storage unit number and check completeness
		When I enter '00000000109330000016' into storageUnitInput in action.RollerConveyor view
		Then on the Roller Conveyor Page: I should see storageBinSelection contains 2 enabled items
		Then I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see quantityInput with value '543,789' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'false' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with value 'MG' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with editable being 'false' in action.RollerConveyor view
		 And I cannot see saveButton in action.RollerConveyor view
		When I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on 3rd item of storageBinSelection items in action.RollerConveyor view
		Then I can see storageBinSelection with valueState 'Success' in action.RollerConveyor view
		Then I can see saveButton in action.RollerConveyor view

	@lastLE
	Scenario: Should display info message if last storage unit has been entered
		When I enter '90000000000000000000' into storageUnitInput in action.RollerConveyor view
		 And I enter 'st' into unitOfMeasureInput in action.RollerConveyor view
		 And I enter '4711' into quantityInput in action.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on 4th item of storageBinSelection items in action.RollerConveyor view
		Then I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see storageBinSelection with valueState 'Success' in action.RollerConveyor view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Letzte Palette!' in action.RollerConveyor view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Information' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with value 'ST' in action.RollerConveyor view
		Then I can see saveButton in action.RollerConveyor view
	
	@lastLE
	Scenario: Should repair input if users enter last unit number 
		When I enter '10' into quantityInput in action.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on first item of storageBinSelection items in action.RollerConveyor view
		 And I can see storageBinSelection with valueState 'Success' in action.RollerConveyor view
		 And I enter '90000000000000000000' into storageUnitInput in action.RollerConveyor view
		Then I can see storageUnitInput with value '90000000000000000000' in action.RollerConveyor view
		 And I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see storageBinSelection with value '' in action.RollerConveyor view
		 And I can see storageBinSelection with valueState 'Error' in action.RollerConveyor view
		 And I can see quantityInput with value '' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with editable being 'true' in action.RollerConveyor view
	
	Scenario: User clears the input form
		When I enter '00000000109330000015' into storageUnitInput in action.RollerConveyor view
		 And I enter '10,000' into quantityInput in action.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on first item of storageBinSelection items in action.RollerConveyor view
		Then I can see saveButton in action.RollerConveyor view
		When I click on clearFormButton in action.RollerConveyor view
		Then on the Roller Conveyor Page: I should see the save button is disabled
		Then on the Roller Conveyor Page: I should see all input fields are initial
		Then on the Roller Conveyor Page: I should see data model and view model are initial
		When I enter '90000000000000000000' into storageUnitInput in action.RollerConveyor view
		 And I enter '11,000' into quantityInput in action.RollerConveyor view
		 And I enter 'kg' into unitOfMeasureInput in action.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on 2nd item of storageBinSelection items in action.RollerConveyor view
		Then I can see saveButton in action.RollerConveyor view
		When I click on clearFormButton in action.RollerConveyor view
		Then on the Roller Conveyor Page: I should see the save button is disabled
		Then on the Roller Conveyor Page: I should see all input fields are initial
		Then on the Roller Conveyor Page: I should see data model and view model are initial

	@lastUnit @emptyLE 
	Scenario: When entering last unit, you should not be able to select Rolltor or Stapler, only Beumer and Palettierer and you should be able to enter quantity and unit
		When I enter '90000000000000000000' into storageUnitInput in action.RollerConveyor view
		Then I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see quantityInput with value '' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'true' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with editable being 'true' in action.RollerConveyor view
		Then on the Roller Conveyor Page: I should see storageBinSelection contains other 2 enabled items
		When I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on 2nd item of storageBinSelection items in action.RollerConveyor view
		Then I can see storageBinSelection with selectedKey 'BEUM' in action.RollerConveyor view
		 And I can see storageBinSelection with valueState 'Success' in action.RollerConveyor view
		When I click on last item of storageBinSelection items in action.RollerConveyor view
		Then I can see storageBinSelection with selectedKey 'PALE' in action.RollerConveyor view
		 And I can see storageBinSelection with valueState 'Success' in action.RollerConveyor view
		 
	@lastUnit @emptyLE @Beumer BEUM: "00248110"
	Scenario: When entering last unit, and when selecting Beumer, then you should find process order, and then post 555, and then post 999
		When I enter '90024811000000000000' into storageUnitInput in action.RollerConveyor view
		Then I can see storageBinSelection with selectedKey 'BEUM' in action.RollerConveyor view
		 And I can see storageBinSelection with value 'BEUMER' in action.RollerConveyor view
		 And I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see quantityInput with value '' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'true' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with editable being 'true' in action.RollerConveyor view
		When I enter '100,123' into quantityInput in action.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Letzte Palette '900248110' erfolgreich von BEUMER an Rollenbahn gemeldet' in action.RollerConveyor view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.RollerConveyor view

	@lastUnit @emptyLE @Palettierer PALE: "00253110"
	Scenario: When entering last unit, and when selecting Palettierer, then you should find process order, and then post 555, and then post 999
		When I enter '90025311000000000000' into storageUnitInput in action.RollerConveyor view
		Then I can see storageBinSelection with selectedKey 'PALE' in action.RollerConveyor view
		 And I can see storageBinSelection with value 'PALETTIERER' in action.RollerConveyor view
		 And I can see storageUnitInput with valueState 'Success' in action.RollerConveyor view
		 And I can see quantityInput with value '' in action.RollerConveyor view
		 And I can see quantityInput with editable being 'true' in action.RollerConveyor view
		 And I can see unitOfMeasureInput with editable being 'true' in action.RollerConveyor view
		When I enter '321,456' into quantityInput in action.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Letzte Palette '900253110' erfolgreich von PALETTIERER an Rollenbahn gemeldet' in action.RollerConveyor view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.RollerConveyor view
		 
	@currentUnit @emptyLE
	Scenario: When entering current unit with stock quantity = 0 (empty), then you should post 101, then you should post 999
		When I enter '00000000109330000015' into storageUnitInput in action.RollerConveyor view
		 And I enter '47,11' into quantityInput in action.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on first item of storageBinSelection items in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Palette '109330000015' erfolgreich eingebucht und von ROLLTOR an Rollenbahn gemeldet' in action.RollerConveyor view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.RollerConveyor view
		 
	@currentUnit @fullLE
	Scenario: When entering current unit with stock quantity > 0 (full), then you should post 999
		When I enter '00000000109330000016' into storageUnitInput in action.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on 3rd item of storageBinSelection items in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Palette '109330000016' erfolgreich von STAPLER an Rollenbahn gemeldet' in action.RollerConveyor view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with type 'Success' in action.RollerConveyor view
	
	@currentUnit @emptyLE
	Scenario: Should successfully post stock transfer, despite goods receipt posting returning error ZMII_MESSAGES 030-034
		When I enter '00000000109330000013' into storageUnitInput in action.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.RollerConveyor view
		 And I click on first item of storageBinSelection items in action.RollerConveyor view
		 And I enter '100,000' into quantityInput in action.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Wareneingang von Palette '109330000013' und Umlagerung nach Lagerplatz 'PRODUKTION' wurde erfolgreich gebucht!' in action.RollerConveyor view
		 And I can see the last sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Retr.Buchung: BWART 261 mit Material 123456-789 und Auftrag 1093300 fehlgeschlagen.' in action.RollerConveyor view
		 
	@lastUnit @emptyLE @Palettierer PALE: "00253110"
	Scenario: Should successfully post stock transfer, despite goods receipt posting returning error ZMII_MESSAGES 030-034
		When I enter '90025311000000000000' into storageUnitInput in action.RollerConveyor view
		 And I enter '75,000' into quantityInput in action.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.RollerConveyor view
		 And I click on saveButton in action.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Wareneingang von Palette '109330000013' und Umlagerung nach Lagerplatz 'PRODUKTION' wurde erfolgreich gebucht!' in action.RollerConveyor view
		 And I can see the last sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Retr.Buchung: BWART 261 mit Material 123456-789 und Auftrag 1093300 fehlgeschlagen.' in action.RollerConveyor view
		 