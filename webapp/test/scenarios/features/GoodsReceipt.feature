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
		 And I can see storageBinInput in action.GoodsReceipt view
		 And I can see quantityInput in action.GoodsReceipt view
		 And I can see unitOfMeasureInput in action.GoodsReceipt view
		 And I can see orderNumberInput in action.GoodsReceipt view
		 And I can see storageLocationInput in action.GoodsReceipt view
		 And I can see infoTestArea in action.GoodsReceipt view
		 And I can see saveButton in action.GoodsReceipt view
		 And I can see cancelButton in action.GoodsReceipt view
		
	Scenario: User enters a storge bin number
		When I enter '012365479789' into storageBinInput in action.GoodsReceipt view
		Then I can see storageBinInput with value '012365479789' in action.GoodsReceipt view
		 And I can see quantityInput with value '200' in action.GoodsReceipt view
		 And I can see unitOfMeasureInput with value 'KG' in action.GoodsReceipt view
		 And I can see storageLocationInput with value '100' in action.GoodsReceipt view
		 And I can see storageLocationInput with editable 'false' in action.GoodsReceipt view
		
	Scenario: User enters storage location VG01
		When I enter 'VG01' into storageLocationInput in action.GoodsReceipt view
		Then I can see the error message
		 And I can see storageLocationInput with value '' in action.GoodsReceipt view