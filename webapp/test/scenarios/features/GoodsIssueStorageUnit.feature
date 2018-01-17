Feature: Creating goods issue posting to SAP ERP using storage unit number
	Users can post GIs by entering storage unit number (aka palette) to post a quantity.
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
		When I enter 'phigem' into usernameInput in Login view
		 And I click on loginButton in Login view
		 And I click on navGoodsMovementItem in nav.Home view
		 And I click on goodsIssueWithLEItem in nav.GoodsMovement view
		
	Scenario: Should navigate to Goods Issue Page (with LE) and see all UI elements
		Then I can see goodsIssuePage in action.GoodsIssue view
		Then I can see storageUnitInput in action.GoodsIssue view
		Then I can see quantityInput with value '0,000' in action.GoodsIssue view
		Then I can see unitOfMeasureInput in action.GoodsIssue view
		Then I can see orderNumberInput in action.GoodsIssue view
		Then I can see clearFormButton in action.GoodsIssue view
		Then I can see cancelButton in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		Then on the Goods Issue Page: I should see all "with LE" input fields are initial

	Scenario: Should enable save button if all required input fields are populated
		When I enter '00000000109330000001' into storageUnitInput in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter '1093300' into orderNumberInput in action.GoodsIssue view
		Then I can see saveButton in action.GoodsIssue view
		When I enter '0,000' into quantityInput in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled

	Scenario: Should show storage unit data if LE was entered
		When I enter '00000000109330000001' into storageUnitInput in action.GoodsIssue view
		Then I can see storageUnitFramgentMaterialInfoText with text '1100000-123' in in action.GoodsIssue view
		 And I can see storageUnitFramgentBatchText with text '0100123369' in in action.GoodsIssue view
		 And I can see storageUnitFramgentXXText with text 'XX' in in action.GoodsIssue view
		 And I can see storageUnitFramgentXXXText with text 'XXX' in in action.GoodsIssue view
		 And I can see storageUnitFramgentXXXXText with text 'XXXX' in in action.GoodsIssue view
		 And I can see storageUnitFramgentXXXXXText with text 'XXXXX' in in action.GoodsIssue view
	 
	Scenario: Should show warning icon if users enter LE with restricted stock (special stock indicator)
		When I enter '12345678900' into storageUnitInput in action.GoodsIssue view
		Then I can see storageUnitFramgentXXText with text 'XX' in in action.GoodsIssue view
		 And I can see specialStockIndicatorIcon in action.GoodsIssue view
		 
	Scenario: Should show confirmation popup if users enter material number that is not contained in order component list (Unplanned Withdrawal)
		When I enter 'XXXX' into storageUnitInput in action.GoodsIssue view
		 And I enter '##' into orderNumberInput in action.GoodsIssue view
		Then I can see storageUnitFramgentMaterialInfoText with text 'XXXXX' in in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the "Unplanned Withdrawal" MessageBox
		
	Scenario: Should show error message if users enter material number that is backflushed
		When I enter 'XXXX' into storageUnitInput in action.GoodsIssue view
		 And I enter '##' into orderNumberInput in action.GoodsIssue view
		 Then I can see messageStrip with text 'Komponente '00000000109330000002' word retrograd entnommen!' in action.GoodsReceipt view
		 Then on the Goods Issue Page: I should see the save button is disabled
	
	Scenario: Should show success message if users post goods issue successfully
		When I enter 'XXXX' into storageUnitInput in action.GoodsIssue view
		 And I enter 'XXX' into orderNumberInput in action.GoodsIssue view
		 And I click on saveButton in action.GoodsIssue view
		Then I can see messageStrip with text 'Warenausgang erfolgreich gebucht!' in action.GoodsReceipt view