Feature: Creating goods receipt posting to SAP ERP
	Users can post GRs by entering storage bin number (aka palette) to post a quantity.
	Users also can post GRs by entering order number, quantity and storage location.
	Entering a storage bin number, will show the neccessarry data of that storage bin,
	and prepopulate some input fields.
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		When I enter 'phigem' into usernameInput in Login view
		 And I click on loginButton in Login view
		 And I click on navGoodsMovementItem in nav.Home view
		 And I click on goodsReceiptItem in nav.GoodsMovement view
		
	Scenario: Should navigate to Goods Receipt Page and see all UI elements
		Then I can see goodsReceiptPage in action.GoodsReceipt view
		 And I can see storageUnitInput in action.GoodsReceipt view
		 And I can see quantityInput in action.GoodsReceipt view
		 And I can see unitOfMeasureInput in action.GoodsReceipt view
		 And I can see orderNumberInput in action.GoodsReceipt view
		 And I can see storageLocationInput in action.GoodsReceipt view
		 And I can see saveButton in action.GoodsReceipt view
		 And I can see cancelButton in action.GoodsReceipt view
		
	Scenario: User enters a storge bin number
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
		
	Scenario: User enters a storge bin number
		When I enter '1093300' into orderNumberInput in action.GoodsReceipt view
		Then I can see storageUnitInput with value '' in action.GoodsReceipt view
		 And I can see storageUnitInput with editable 'false' in action.GoodsReceipt view
		 And I can see unitOfMeasureInput with editable 'true' in action.GoodsReceipt view
		 
	Scenario: User enters storage location VG01
		When I enter 'VG01' into storageLocationInput in action.GoodsReceipt view
		Then on the Goods Receipt Page: I can see the error message
		 And I can see storageLocationInput with value '' in action.GoodsReceipt view
		When I press the OK button on error dialog
		 Then I can see storageLocationInput with errorStarte 'Error' in action.GoodsReceipt view