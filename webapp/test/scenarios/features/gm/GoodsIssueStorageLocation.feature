Feature: Goods Issue without LE
	Users also can post GIs by entering order number, quantity and storage location.
	Users can choose to post bulk matrial.
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		 When I navigate to /WA?type=nonLE
		
	Scenario: Should navigate to Goods Issue Page (non LE) and see all UI elements
		Then I can see goodsIssuePage in action.gm.GoodsIssue view
		Then I can see quantityInput with value '' in action.gm.GoodsIssue view
		Then I can see clearQuantityInputIcon in action.gm.GoodsIssue view
		Then I can see unitOfMeasureInput in action.gm.GoodsIssue view
		Then I can see orderNumberInput in action.gm.GoodsIssue view
		Then I can see storageLocationInput in action.gm.GoodsIssue view
		Then I can see materialNumberInput in action.gm.GoodsIssue view
		Then I can see bulkMaterialText in action.gm.GoodsIssue view
		Then I can see bulkMaterialSwitch in action.gm.GoodsIssue view
		Then I can see clearQuantityInputIcon with src 'sap-icon://eraser' in action.gm.GoodsIssue view
		Then I can see clearFormButton in action.gm.GoodsIssue view
		Then I can see cancelButton with text 'Abbrechen' in action.gm.GoodsIssue view
		Then I can see goodsIssuePageIcon with src 'sap-icon://outbox' in action.gm.GoodsIssue view
		Then I can see goodsIssuePageIcon with color '#BB07FF' in action.gm.GoodsIssue view
		Then I can see goodsIssuePageIcon2 with src 'sap-icon://filter' in action.gm.GoodsIssue view
		Then I can see goodsIssuePageIcon2 with color '#BB07FF' in action.gm.GoodsIssue view
		Then I can see goodsIssuePageTitle in action.gm.GoodsIssue view has css color '#BB07FF'
		Then I cannot see storageUnitInput in action.gm.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		Then on the Goods Issue Page: I should see all "non LE" input fields are initial
		Then on the Goods Issue Page: I should see data model and view model "non LE" are initial
		
	Scenario: Should enable save button if all required input fields are populated and should disable save button if form is cleared
		When I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter '321,123' into quantityInput in action.gm.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I click on clearQuantityInputIcon in action.gm.GoodsIssue view
		Then I can see quantityInput with value '' in action.gm.GoodsIssue view
		When I enter '321,123' into quantityInput in action.gm.GoodsIssue view
		 And I enter 'kg' into unitOfMeasureInput in action.gm.GoodsIssue view
		Then I can see unitOfMeasureInput with value 'KG' in action.gm.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter 'rb01' into storageLocationInput in action.gm.GoodsIssue view
		Then I can see storageLocationInput with value 'RB01' in action.gm.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter '1230001-001' into materialNumberInput in action.gm.GoodsIssue view
		Then I can see saveButton in action.gm.GoodsIssue view
		When I click on clearFormButton in action.gm.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		
	Scenario: Should validate order number
		When I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		Then I can see orderNumberInput with valueState 'Success' in action.gm.GoodsIssue view
		When I enter '1200666-004' into materialNumberInput in action.gm.GoodsIssue view
		When I enter '10' into quantityInput in action.gm.GoodsIssue view
		When I enter 'rb01' into storageLocationInput in action.gm.GoodsIssue view
		Then I can see saveButton in action.gm.GoodsIssue view
		When I enter '1000001' into orderNumberInput in action.gm.GoodsIssue view
		Then I can see orderNumberInput with valueState 'Error' in action.gm.GoodsIssue view
	 	Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1000001' nicht gefunden.' in action.gm.GoodsIssue view
	 	Then on the Goods Issue Page: I should see the save button is disabled
	 	
	Scenario: Should init data model and input fields if users clear form
		When I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		 And I enter '1200666-004' into materialNumberInput in action.gm.GoodsIssue view
		 And I enter '10' into quantityInput in action.gm.GoodsIssue view
		 And I enter 'rb01' into storageLocationInput in action.gm.GoodsIssue view
		Then I can see saveButton in action.gm.GoodsIssue view
		When I click on clearFormButton in action.gm.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		Then on the Goods Issue Page: I should see all "non LE" input fields are initial
		Then on the Goods Issue Page: I should see data model and view model "non LE" are initial
		
	Scenario: Should validate material number with order number
		When I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		Then I can see orderNumberInput with valueState 'Success' in action.gm.GoodsIssue view
		When I enter '0000000-000' into materialNumberInput in action.gm.GoodsIssue view
		Then I can see materialNumberInput with valueState 'Warning' in action.gm.GoodsIssue view
		 And I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Ungeplante Entnahme: Komponente '0000000-000' für Auftrag '1234567' nicht vorgesehen!' in action.gm.GoodsIssue view
		When I enter '1200666-004' into materialNumberInput in action.gm.GoodsIssue view
		Then I can see materialNumberInput with valueState 'Success' in action.gm.GoodsIssue view
		Then I can see unitOfMeasureInput with value 'ST' in action.gm.GoodsIssue view
		When I click on clearFormButton in action.gm.GoodsIssue view
		Then I can see materialNumberInput with valueState 'None' in action.gm.GoodsIssue view
		Then I can see orderNumberInput with valueState 'None' in action.gm.GoodsIssue view
		Then I can see materialNumberInput with valueState 'None' in action.gm.GoodsIssue view
	
	Scenario: Should calculate remaining open quantity if input quantity is zero
		When I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		Then I can see quantityInput with value '' in action.gm.GoodsIssue view
		When I enter '1200666-006' into materialNumberInput in action.gm.GoodsIssue view
		Then I can see quantityInput with value '130,000' in action.gm.GoodsIssue view
		When I click on clearFormButton in action.gm.GoodsIssue view
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		 And I enter '999,999' into quantityInput in action.gm.GoodsIssue view
		 And I enter '1200666-006' into materialNumberInput in action.gm.GoodsIssue view
		Then I can see quantityInput with value '999,999' in action.gm.GoodsIssue view
		
	Scenario: Should show success message if users post goods issue successfully
		When I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		 And I enter '1200666-006' into materialNumberInput in action.gm.GoodsIssue view
		 And I enter '10' into quantityInput in action.gm.GoodsIssue view
		 And I enter 'rb01' into storageLocationInput in action.gm.GoodsIssue view
		When I click on saveButton in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text 'Warenausgang zu Auftrag '1234567' wurde erfolgreich gebucht!' in action.gm.GoodsIssue view