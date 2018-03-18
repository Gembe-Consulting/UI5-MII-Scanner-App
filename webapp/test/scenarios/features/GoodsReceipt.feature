Feature: Goods Receipt
	Users can post GRs by entering storage unit number (aka palette) to post a quantity.
	Users also can post GRs by entering order number, quantity and storage location.
	Entering a storage unit number will show the neccessarry data of that storage unit,
	and pre-populate some input fields.
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		 When I navigate to /WE
		
	Scenario: Should navigate to Goods Receipt Page and see all UI elements
		Then I can see goodsReceiptPage in action.GoodsReceipt view
		Then I can see storageUnitInput in action.GoodsReceipt view
		Then I can see quantityInput with value '' in action.GoodsReceipt view
		Then I can see clearQuantityInputIcon in action.GoodsReceipt view
		Then I can see unitOfMeasureInput in action.GoodsReceipt view
		Then I can see orderNumberInput in action.GoodsReceipt view
		Then I can see storageLocationInput in action.GoodsReceipt view
		Then I can see clearFormButton in action.GoodsReceipt view
		Then I can see cancelButton with text 'Abbrechen' in action.GoodsReceipt view
		Then I can see goodsReceiptPageIcon with src 'sap-icon://inbox' in action.GoodsReceipt view
		Then I can see goodsReceiptPageIcon with color '#1F35DE' in action.GoodsReceipt view
		Then I can see goodsReceiptPageTitle in action.GoodsReceipt view has css color '#1F35DE'
		Then on the Goods Receipt Page: I should see the save button is disabled
		Then on the Goods Receipt Page: I should see all input fields are initial
		Then on the Goods Receipt Page: I should see data model and view model are initial
		
	Scenario: User enters a storge unit number and sees the storge unit data
		When I enter '00000000109330000001' into storageUnitInput in action.GoodsReceipt view
		Then I can see storageUnitInput with value '109330000001' in action.GoodsReceipt view
		 And I can see storageUnitInput with valueState 'Success' in action.GoodsReceipt view
		 And I can see quantityInput with value '600,000' in action.GoodsReceipt view
		 And I can see unitOfMeasureInput with value 'KG' in action.GoodsReceipt view
		 And I can see unitOfMeasureInput with editable being 'false' in action.GoodsReceipt view
		 And I can see storageLocationInput with value '1000' in action.GoodsReceipt view
		 And I can see storageLocationInput with editable being 'false' in action.GoodsReceipt view
		 And I can see orderNumberInput with value '1093300' in action.GoodsReceipt view
		 And I can see orderNumberInput with editable being 'false' in action.GoodsReceipt view
		 And I can see saveButton with enabled being 'true' in action.GoodsReceipt view
		When I enter '00000000000000000001' into storageUnitInput in action.GoodsReceipt view
		Then I can see messageStrip with text starting with 'Palette '00000000000000000001' nicht gefunden.' in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		
	Scenario: User enters a order number
		When I enter '1093300' into orderNumberInput in action.GoodsReceipt view
		Then I can see orderNumberInput with valueState 'Success' in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		When I enter '4711' into storageLocationInput in action.GoodsReceipt view
		Then I can see storageUnitInput with value '' in action.GoodsReceipt view
		 And I can see storageUnitInput with editable being 'false' in action.GoodsReceipt view
		When I enter '600,000' into quantityInput in action.GoodsReceipt view
		And I enter 'kg' into unitOfMeasureInput in action.GoodsReceipt view
		Then I can see unitOfMeasureInput with value 'KG' in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is enabled
		When I click on clearQuantityInputIcon in action.GoodsReceipt view
		Then I can see quantityInput with value '' in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		When I enter '600,000' into quantityInput in action.GoodsReceipt view
		 And I enter '1000' into storageLocationInput in action.GoodsReceipt view
		Then I can see storageUnitInput with editable being 'true' in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		When I enter '4712' into storageLocationInput in action.GoodsReceipt view
		 And I press ENTER at storageLocationInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is enabled
		When I enter '1000001' into orderNumberInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		
	Scenario: Should propose unit of measure if users enter storage location not equal 1000
		When I enter 'RB01' into storageLocationInput in action.GoodsReceipt view
		Then I can see unitOfMeasureInput with value 'KG' in action.GoodsReceipt view
		When I enter '1000' into storageLocationInput in action.GoodsReceipt view
		Then I can see unitOfMeasureInput with value '' in action.GoodsReceipt view
		When I enter 'ST' into unitOfMeasureInput in action.GoodsReceipt view
		 And I enter 'RB01' into storageLocationInput in action.GoodsReceipt view
		Then I can see unitOfMeasureInput with value 'ST' in action.GoodsReceipt view
	
	Scenario: User clears the input form
		When I enter '00000000109330000001' into storageUnitInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is enabled
		When I click on clearFormButton in action.GoodsReceipt view 
		Then on the Goods Receipt Page: I should see the save button is disabled
		Then on the Goods Receipt Page: I should see all input fields are initial
		When I enter '4711' into storageLocationInput in action.GoodsReceipt view
		 And I enter '600,000' into quantityInput in action.GoodsReceipt view
		 And I enter 'KG' into unitOfMeasureInput in action.GoodsReceipt view
		 And I enter '1093300' into orderNumberInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is enabled
		When I click on clearFormButton in action.GoodsReceipt view 
		Then on the Goods Receipt Page: I should see the save button is disabled
		Then on the Goods Receipt Page: I should see all input fields are initial
	
	Scenario: User enters a storage unit with zero remaining quantity
		When I enter '00000000109330000002' into storageUnitInput in action.GoodsReceipt view
		Then I can see quantityInput with value '0,000' in action.GoodsReceipt view
		 And I can see messageStrip with text 'Palette '00000000109330000002' wurde bereits gebucht!' in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		 And I can see quantityInput with editable being 'false' in action.GoodsReceipt view
		When I click on clearFormButton in action.GoodsReceipt view 
		Then on the Goods Receipt Page: I should see the save button is disabled
		Then on the Goods Receipt Page: I should see all input fields are initial
		 And I can see quantityInput with editable being 'true' in action.GoodsReceipt view
	
	Scenario: User enters storage location VG01
		When I enter 'VG01' into storageLocationInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I can see the error message
		When on the Goods Receipt Page: I close the error message
		Then I can see storageLocationInput with valueState 'Error' in action.GoodsReceipt view
		
	Scenario: User is successfully posting full storage unit quantity
		When I enter '00000000109330000001' into storageUnitInput in action.GoodsReceipt view
		 And I click on saveButton in action.GoodsReceipt view 
		Then I can see messageStrip with text 'Warenbewegung wurde mit LE '109330000001' erfolgreich gebucht!' in action.GoodsReceipt view 
		Then on the Goods Receipt Page: I should see the save button is disabled
		Then on the Goods Receipt Page: I should see all input fields are initial
		
	Scenario: User is successfully posting partial storage unit quantity
		When I enter '00000000109330000003' into storageUnitInput in action.GoodsReceipt view
		 And I enter '300,000' into quantityInput in action.GoodsReceipt view
		 And I click on saveButton in action.GoodsReceipt view 
		Then I can see messageStrip with text 'Warenbewegung wurde mit LE '109330000003' erfolgreich gebucht!' in action.GoodsReceipt view 
		Then on the Goods Receipt Page: I should see the save button is disabled
		Then on the Goods Receipt Page: I should see all input fields are initial