Feature: Creating a stock transfer 
	Users can create a stock transfer, either with goods receipt to process order or without.
	Entering a storage unit number will show the neccessarry data of that storage unit,
	and pre-populate some input fields.
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		When I navigate to "Start/Materialbewegung/UL"
		
	Scenario: Should navigate to Stock Transfer Page and see all UI elements
		Then I can see stockTransferPage in action.StockTransfer view
		Then I can see storageBinSelection with editable is 'true' in action.StockTransfer view
		Then storageBinSelection in action.StockTransfer view contains 16 items
		Then I can see storageUnitInput with editable is 'true' in action.StockTransfer view
		Then I can see storageUnitInput with value '' in action.StockTransfer view
		Then I can see quantityInput with value '0,000' in action.StockTransfer view
		Then I can see unitOfMeasureInput in action.StockTransfer view
		Then I can see orderNumberInput with editable is 'false' in action.StockTransfer view
		Then I can see clearFormButton in action.StockTransfer view
		Then I can see cancelButton in action.StockTransfer view
		Then I cannot see saveButton in action.StockTransfer view
#		Then on the Stock Transfer Page: I should see all input fields are initial

	Scenario: Should select the correct storage bin key when users select an entry from storage bin list
		When I press ARROW_DOWN + ALT at storageBinSelection in action.StockTransfer view
		 And I click on first item of storageBinSelection items in action.StockTransfer view
		Then I can see storageBinSelection with selectedKey 'BA01' in action.StockTransfer view
		 And I can see storageBinSelection with valueState 'Success' in action.StockTransfer view
		When I click on last item of storageBinSelection items in action.StockTransfer view
		Then I can see storageBinSelection with selectedKey 'PRODUKTION' in action.StockTransfer view
		 And I can see storageBinSelection with valueState 'Success' in action.StockTransfer view
		When I enter 'NON_EXISTING_STORAGE_BIN' into storageBinSelection in action.StockTransfer view
		Then I can see storageBinSelection with selectedKey '' in action.StockTransfer view
		 And I can see storageBinSelection with valueState 'Error' in action.StockTransfer view
		When I click on clearFormButton in action.StockTransfer view
		Then I can see storageBinSelection with valueState 'None' in action.StockTransfer view
		
	Scenario: Should read storage unit data and validate data when users enter storage unit number
		When I enter '00000000109330000013' into storageUnitInput in action.StockTransfer view
		Then I can see storageUnitInput with value '109330000013' in action.StockTransfer view
		 And I can see storageUnitInput with valueState 'Success' in action.StockTransfer view
		 And I can see quantityInput with editable is 'true' in action.StockTransfer view
		When I click on clearFormButton in action.StockTransfer view
		 And I can see quantityInput with editable is 'false' in action.StockTransfer view
		When I enter '00000000109330000014' into storageUnitInput in action.StockTransfer view
		Then I can see storageUnitInput with value '109330000014' in action.StockTransfer view
		 And I can see storageUnitInput with valueState 'Success' in action.StockTransfer view
		 And I can see quantityInput with editable is 'false' in action.StockTransfer view
		When I click on clearFormButton in action.StockTransfer view
		Then I can see storageUnitInput with valueState 'None' in action.StockTransfer view
		When I enter '00000000000000000001' into storageUnitInput in action.StockTransfer view
		Then I can see storageUnitInput with valueState 'Error' in action.StockTransfer view
		 And I can see messageStrip with text 'Achtung: Palette '00000000000000000001' existiert nicht!' in action.StockTransfer view
		 And I can see messageStrip with type 'Error' in action.StockTransfer view