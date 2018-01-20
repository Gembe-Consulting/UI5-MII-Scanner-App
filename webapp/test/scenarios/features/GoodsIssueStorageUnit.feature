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

	Scenario: Should enable save button if all required input fields are populated and should disable save button if form is cleared
		When I enter '00000000109330000004' into storageUnitInput in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter '1093300' into orderNumberInput in action.GoodsIssue view
		Then I can see saveButton in action.GoodsIssue view
		When I enter '0,000' into quantityInput in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		When I enter '1,000' into quantityInput in action.GoodsIssue view
		Then I can see saveButton in action.GoodsIssue view
		When I click on clearFormButton in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled

	Scenario: Should show storage unit data if LE was entered
		When I enter '00000000109330000004' into storageUnitInput in action.GoodsIssue view
		Then I can see storageUnitFragmentMaterialInfoText with text '1700948-030 - Zucker-Fett-VBT V185 RSPO-MB 600, BB' in action.GoodsIssue view
		 And I can see storageUnitFragmentBatchText with text '0109330001' in action.GoodsIssue view
		 And I can see storageUnitFragmentStorageBinText with text 'PRODUKTION' in action.GoodsIssue view
		 And I can see storageUnitFragmentStorageTypeText with text '900' in action.GoodsIssue view
		 And I can see storageUnitFragmentStorageUnitTypeText with text 'EuroPalette' in action.GoodsIssue view
		 And I can see storageUnitFragmentExpirationDateText with text '05.03.2018' in action.GoodsIssue view
	 
	Scenario: Should not override previously entered quantity if LE was entered afterwards
		When I enter '100,000' into quantityInput in action.GoodsIssue view
		 And I enter '00000000109330000004' into storageUnitInput in action.GoodsIssue view
		Then I can see quantityInput with value '100,000' in action.GoodsIssue view
		 And I can see unitOfMeasureInput with value 'KG' in action.GoodsIssue view
		 
	Scenario: Should show warning icon if users enter LE with restricted stock (special stock indicator)
		When I enter '00000000109330000004' into storageUnitInput in action.GoodsIssue view
		Then I can see storageUnitFragmentSpecialStockIndicatorText with text 'Q' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockIndicatorIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see specialStockIndicatorIcon with color '#f9a429' in action.GoodsIssue view
		 
	Scenario: Should show warning icon if users enter LE with past expiration date and prevent posting
		When I enter '00000000109330000004' into storageUnitInput in action.GoodsIssue view
		Then I can see storageUnitFragmentPastExpirationDateIcon with color '#ee0000' in action.GoodsIssue view
		 And I can see pastExpirationDateIcon with color '#ee0000' in action.GoodsIssue view
		 And I can see messageStrip with text 'Achtung: MHD der Charge 0109331231 ist am 20.12.2010 abgelaufen!' in action.GoodsIssue view 
		When I enter '1093300' into orderNumberInput in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		
	@wip	 
	Scenario: Should show confirmation popup if users enter material number that is not contained in order component list (Unplanned Withdrawal)
		When I enter 'XXXX' into storageUnitInput in action.GoodsIssue view
		 And I enter '##' into orderNumberInput in action.GoodsIssue view
		Then I can see storageUnitFragmentMaterialInfoText with text 'XXXXX' in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the "Unplanned Withdrawal" MessageBox
	
	@wip	
	Scenario: Should show error message if users enter material number that is backflushed
		When I enter 'XXXX' into storageUnitInput in action.GoodsIssue view
		 And I enter '##' into orderNumberInput in action.GoodsIssue view
		 Then I can see messageStrip with text 'Komponente '00000000109330000002' word retrograd entnommen!' in action.GoodsIssue view
		 Then on the Goods Issue Page: I should see the save button is disabled
	
	@wip
	Scenario: Should show success message if users post goods issue successfully
		When I enter 'XXXX' into storageUnitInput in action.GoodsIssue view
		 And I enter 'XXX' into orderNumberInput in action.GoodsIssue view
		 And I click on saveButton in action.GoodsIssue view
		Then I can see messageStrip with text 'Warenausgang erfolgreich gebucht!' in action.GoodsIssue view