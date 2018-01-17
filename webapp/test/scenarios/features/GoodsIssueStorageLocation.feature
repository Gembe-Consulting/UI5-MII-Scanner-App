Feature: Creating goods issue posting to SAP ERP using storage location
	Users also can post GIs by entering order number, quantity and storage location.
	Users can choose to post bulk matrial.
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		When I enter 'phigem' into usernameInput in Login view
		 And I click on loginButton in Login view
		 And I click on navGoodsMovementItem in nav.Home view
		 And I click on goodsIssueNonLEItem in nav.GoodsMovement view
		
	Scenario: Should navigate to Goods Issue Page (non LE) and see all UI elements
		Then I can see goodsIssuePage in action.GoodsIssue view
		Then I can see quantityInput in action.GoodsIssue view
		Then I can see unitOfMeasureInput in action.GoodsIssue view
		Then I can see orderNumberInput in action.GoodsIssue view
		Then I can see materialNumberInput in action.GoodsIssue view
		Then I can see bulkMaterialSwitch in action.GoodsIssue view
		Then I can see clearFormButton in action.GoodsIssue view
		Then I can see cancelButton in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		Then on the Goods Issue Page: I should see all "non LE" input fields are initial