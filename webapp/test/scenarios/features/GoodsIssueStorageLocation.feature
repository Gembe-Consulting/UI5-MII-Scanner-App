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
		Then I can see quantityInput with value '' in action.GoodsIssue view
		Then I can see clearQuantityInputIcon in action.GoodsIssue view
		Then I can see unitOfMeasureInput in action.GoodsIssue view
		Then I can see orderNumberInput in action.GoodsIssue view
		Then I can see storageLocationInput in action.GoodsIssue view
		Then I can see materialNumberInput in action.GoodsIssue view
		Then I can see bulkMaterialSwitch in action.GoodsIssue view
		Then I can see clearQuantityInputIcon with src 'sap-icon://eraser' in action.GoodsIssue view
		Then I can see clearFormButton in action.GoodsIssue view
		Then I can see cancelButton with text 'Abbrechen' in action.GoodsIssue view
		Then I can see goodsIssuePageIcon with src 'sap-icon://outbox' in action.GoodsIssue view
		Then I can see goodsIssuePageIcon with color '#BB07FF' in action.GoodsIssue view
		Then I can see goodsIssuePageIcon2 with src 'sap-icon://filter' in action.GoodsIssue view
		Then I can see goodsIssuePageIcon2 with color '#BB07FF' in action.GoodsIssue view
		Then I can see goodsIssuePageTitle in action.GoodsIssue view has css color '#BB07FF'
		Then on the Goods Issue Page: I should see the save button is disabled
		Then on the Goods Issue Page: I should see all "non LE" input fields are initial
		Then on the Goods Issue Page: I should see data model and view are initial
		
	Scenario: Should enable save button if all required input fields are populated and should disable save button if form is cleared
		When I enter '1234567' into orderNumberInput in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter '321,123' into quantityInput in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I click on clearQuantityInputIcon in action.GoodsIssue view
		Then I can see quantityInput with value '' in action.GoodsIssue view
		When I enter '321,123' into quantityInput in action.GoodsIssue view
		 And I enter 'kg' into unitOfMeasureInput in action.GoodsIssue view
		Then I can see unitOfMeasureInput with value 'KG' in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter 'rb01' into storageLocationInput in action.GoodsIssue view
		Then I can see storageLocationInput with value 'RB01' in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter '1230001-001' into materialNumberInput in action.GoodsIssue view
		Then I can see saveButton in action.GoodsIssue view
		When I click on clearFormButton in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		
	Scenario: Should validate order number
		When I enter '1234567' into orderNumberInput in action.GoodsIssue view
		Then I can see orderNumberInput with valueState 'Success' in action.GoodsIssue view
		When I enter '1200666-004' into materialNumberInput in action.GoodsIssue view
		When I enter '10' into quantityInput in action.GoodsIssue view
		When I enter 'rb01' into storageLocationInput in action.GoodsIssue view
		Then I can see saveButton in action.GoodsIssue view
		When I enter '1000001' into orderNumberInput in action.GoodsIssue view
		Then I can see orderNumberInput with valueState 'Error' in action.GoodsIssue view
	 	 And I can see messageStrip with text 'Achtung: Auftrag '1000001' existiert nicht!' in action.GoodsIssue view
	 	Then on the Goods Issue Page: I should see the save button is disabled
		
	Scenario: Should validate material number with order number
		When I enter '1234567' into orderNumberInput in action.GoodsIssue view
		Then I can see orderNumberInput with valueState 'Success' in action.GoodsIssue view
		When I enter '0000000-000' into materialNumberInput in action.GoodsIssue view
		Then I can see materialNumberInput with valueState 'Warning' in action.GoodsIssue view
		 And I can see messageStrip with text 'Ungeplante Entnahme: Komponente '0000000-000' für Auftrag '1234567' nicht vorgesehen!' in action.GoodsIssue view
		When I enter '1200666-004' into materialNumberInput in action.GoodsIssue view
		Then I can see materialNumberInput with valueState 'Success' in action.GoodsIssue view
		Then I can see unitOfMeasureInput with value 'ST' in action.GoodsIssue view
		When I click on clearFormButton in action.GoodsIssue view
		Then I can see materialNumberInput with valueState 'None' in action.GoodsIssue view
		Then I can see orderNumberInput with valueState 'None' in action.GoodsIssue view
		Then I can see materialNumberInput with valueState 'None' in action.GoodsIssue view
	
	Scenario: Should calculate remaining open quantity if input quantity is zero
		When I enter '1234567' into orderNumberInput in action.GoodsIssue view
		Then I can see quantityInput with value '' in action.GoodsIssue view
		When I enter '1200666-006' into materialNumberInput in action.GoodsIssue view
		Then I can see quantityInput with value '130,000' in action.GoodsIssue view
		When I click on clearFormButton in action.GoodsIssue view
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		 And I enter '999,999' into quantityInput in action.GoodsIssue view
		 And I enter '1200666-006' into materialNumberInput in action.GoodsIssue view
		Then I can see quantityInput with value '999,999' in action.GoodsIssue view
		