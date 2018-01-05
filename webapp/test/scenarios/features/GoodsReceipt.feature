Feature: Creating goods receipt posting to SAP ERP
	Users can post GRs by entering storage unit number (aka palette) to post a quantity.
	Users also can post GRs by entering order number, quantity and storage location.
	Entering a storage unit number will show the neccessarry data of that storage unit,
	and pre-populate some input fields.
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		When I enter 'phigem' into usernameInput in Login view
		 And I click on loginButton in Login view
		 And I click on navGoodsMovementItem in nav.Home view
		 And I click on goodsReceiptItem in nav.GoodsMovement view
		
	Scenario: Should navigate to Goods Receipt Page and see all UI elements
		Then I can see goodsReceiptPage in action.GoodsReceipt view
		Then I can see storageUnitInput in action.GoodsReceipt view
		Then I can see quantityInput in action.GoodsReceipt view
		Then I can see unitOfMeasureInput in action.GoodsReceipt view
		Then I can see orderNumberInput in action.GoodsReceipt view
		Then I can see storageLocationInput in action.GoodsReceipt view
		Then I can see clearFormButton in action.GoodsReceipt view
		Then I can see cancelButton in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		Then on the Goods Receipt Page: I should see all input fields are initial
		
	Scenario: User enters a storge unit number and sees the storge unit data
		When I enter '00000000109330000001' into storageUnitInput in action.GoodsReceipt view
		Then I can see storageUnitInput with value '109330000001' in action.GoodsReceipt view
		 And I can see quantityInput with value '600,000' in action.GoodsReceipt view
		 And I can see unitOfMeasureInput with value 'KG' in action.GoodsReceipt view
		 And I can see unitOfMeasureInput with editable 'false' in action.GoodsReceipt view
		 And I can see storageLocationInput with value '1000' in action.GoodsReceipt view
		 And I can see storageLocationInput with editable 'false' in action.GoodsReceipt view
		 And I can see orderNumberInput with value '1093300' in action.GoodsReceipt view
		 And I can see orderNumberInput with editable 'false' in action.GoodsReceipt view
		 And I can see saveButton with enabled 'true' in action.GoodsReceipt view
		
	Scenario: User enters a order number
		When I enter '1093300' into orderNumberInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		When I enter '4711' into storageLocationInput in action.GoodsReceipt view
		Then I can see storageUnitInput with value '' in action.GoodsReceipt view
		 And I can see storageUnitInput with editable 'false' in action.GoodsReceipt view
		When I enter '600,000' into quantityInput in action.GoodsReceipt view
		And I enter 'KG' into unitOfMeasureInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is enabled
		When I enter '1000' into storageLocationInput in action.GoodsReceipt view
		Then I can see storageUnitInput with editable 'true' in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		When I enter '4712' into storageLocationInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is enabled

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
	
	Scenario: User enters a storage unit with zero quantity
		When I enter '00000000109330000002' into storageUnitInput in action.GoodsReceipt view
		Then I can see quantityInput with value '0,000' in action.GoodsReceipt view
		 And I can see messageStrip with text 'LE '00000000109330000002' wurde bereits gebucht!' in action.GoodsReceipt view
		Then on the Goods Receipt Page: I should see the save button is disabled
		 And I can see quantityInput with editable 'false' in action.GoodsReceipt view
		When I click on clearFormButton in action.GoodsReceipt view 
		Then on the Goods Receipt Page: I should see the save button is disabled
		Then on the Goods Receipt Page: I should see all input fields are initial
		 And I can see quantityInput with editable 'true' in action.GoodsReceipt view
	
	Scenario: User enters storage location VG01
		When I enter 'VG01' into storageLocationInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I can see the error message
		When on the Goods Receipt Page: I close the error message
		Then I can see storageLocationInput with valueState 'Error' in action.GoodsReceipt view