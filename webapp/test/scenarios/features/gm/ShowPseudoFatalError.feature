Feature: Show selected Fatal Error as Warning 

	@Stock Transfer
	Scenario: [UML] Should show warning message, if goods receipt failed with fatal error ZMII_MESSAGES 030-034
	   Given I start the app on '/UML' with 'GoodsMovementCreateXac' error 'EZMII_MESSAGES030: Retr.Buchung: BWART 261 mit Material 123456-789 und Auftrag 1093300 fehlgeschlagen.'
		When I enter '00000000109330000113' into storageUnitInput in action.gm.StockTransfer view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.StockTransfer view
		 And I click on 4th item of storageBinSelection items in action.gm.StockTransfer view
		 And I enter '300,000' into quantityInput in action.gm.StockTransfer view
		 And I click on saveButton in action.gm.StockTransfer view
		Then messageStripContainer in action.gm.StockTransfer view contains 2 content
		Then I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'Retr.Buchung: BWART 261 mit Material 123456-789 und Auftrag 1093300 fehlgeschlagen.' in action.gm.StockTransfer view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Warning' in action.gm.StockTransfer view
#		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'Wareneingang von Palette '109330000113' und Umlagerung nach Lagerplatz 'S31' wurde erfolgreich gebucht!' in action.gm.StockTransfer view
#		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Success' in action.gm.StockTransfer view
		 
	@Stock Transfer
	Scenario: [UML] Should show error message, if goods receipt failed with fatal error ECO001: Some other shit happend.
	   Given I start the app on '/UML' with 'GoodsMovementCreateXac' error 'ECO001: Some other shit happend.'
		When I enter '00000000109330000113' into storageUnitInput in action.gm.StockTransfer view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.StockTransfer view
		 And I click on 4th item of storageBinSelection items in action.gm.StockTransfer view
		 And I enter '300,000' into quantityInput in action.gm.StockTransfer view
		 And I click on saveButton in action.gm.StockTransfer view
		Then messageStripContainer in action.gm.StockTransfer view contains 2 content
		Then I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'ECO001: Some other shit happend. @BwA 101' in action.gm.StockTransfer view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Error' in action.gm.StockTransfer view
		 
	@Roller Conveyor @currentUnit
	Scenario: [ROL] Should show warning message, if goods receipt failed with fatal error ZMII_MESSAGES 030-034
	   Given I start the app on '/ROL' with 'GoodsMovementCreateXac' error 'EZMII_MESSAGES031: Retr.Buchung: BWART 261 mit Material 123456-789 und Auftrag 1093300 fehlgeschlagen.'
		When I enter '00000000109330000113' into storageUnitInput in action.gm.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.RollerConveyor view
		 And I click on 1st item of storageBinSelection items in action.gm.RollerConveyor view
		 And I enter '300,000' into quantityInput in action.gm.RollerConveyor view
		 And I click on saveButton in action.gm.RollerConveyor view
		Then messageStripContainer in action.gm.RollerConveyor view contains 2 content
		Then I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'Retr.Buchung: BWART 261 mit Material 123456-789 und Auftrag 1093300 fehlgeschlagen.' in action.gm.RollerConveyor view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Warning' in action.gm.RollerConveyor view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'Palette '109330000113' erfolgreich eingebucht und von ROLLTOR an Rollenbahn gemeldet' in action.gm.RollerConveyor view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Success' in action.gm.RollerConveyor view

	@Roller Conveyor @currentUnit
	Scenario: [ROL] Should show error message, if goods receipt failed with fatal error ECO001: Some other shit happend.
	   Given I start the app on '/ROL' with 'GoodsMovementCreateXac' error 'ECO001: Some other shit happend.'
		When I enter '00000000109330000113' into storageUnitInput in action.gm.RollerConveyor view
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.RollerConveyor view
		 And I click on 1st item of storageBinSelection items in action.gm.RollerConveyor view
		 And I enter '300,000' into quantityInput in action.gm.RollerConveyor view
		 And I click on saveButton in action.gm.RollerConveyor view
		Then messageStripContainer in action.gm.RollerConveyor view contains 1 content
		Then I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'ECO001: Some other shit happend. @BwA 101' in action.gm.RollerConveyor view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Error' in action.gm.RollerConveyor view
		 
	@Roller Conveyor @lastUnit
	Scenario: [ROL] Should show warning message, if goods receipt failed with fatal error ZMII_MESSAGES 030-034
	   Given I start the app on '/ROL' with 'GoodsMovementRollerConveyorCreateXac' error 'EZMII_MESSAGES033: Retr.Buchung: BWART 261 mit Material 123456-789 und Auftrag 1093300 fehlgeschlagen.'
		When I enter '90024811000000000000' into storageUnitInput in action.gm.RollerConveyor view
		 And I enter '300,000' into quantityInput in action.gm.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.gm.RollerConveyor view
		 And I click on saveButton in action.gm.RollerConveyor view
		Then messageStripContainer in action.gm.RollerConveyor view contains 2 content
		Then I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'Retr.Buchung: BWART 261 mit Material 123456-789 und Auftrag 1093300 fehlgeschlagen.' in action.gm.RollerConveyor view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Warning' in action.gm.RollerConveyor view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'Letzte Palette '109330000113' erfolgreich von BEUMER an Rollenbahn gemeldet' in action.gm.RollerConveyor view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Success' in action.gm.RollerConveyor view
		 
	@Roller Conveyor @lastUnit
	Scenario: [ROL] Should show error message, if goods receipt failed with fatal error ECO001: Some other shit happend.
	   Given I start the app on '/ROL' with 'GoodsMovementRollerConveyorCreateXac' error 'ECO001: Some other shit happend.'
		When I enter '90024811000000000000' into storageUnitInput in action.gm.RollerConveyor view
		 And I enter '300,000' into quantityInput in action.gm.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.gm.RollerConveyor view
		 And I click on saveButton in action.gm.RollerConveyor view
		Then messageStripContainer in action.gm.RollerConveyor view contains 2 content
		Then I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with text 'ECO001: Some other shit happend. @BwA 555' in action.gm.RollerConveyor view
		 And I can see the sap.m.MessageStrip control deeply nested inside messageStripContainer with type 'Error' in action.gm.RollerConveyor view