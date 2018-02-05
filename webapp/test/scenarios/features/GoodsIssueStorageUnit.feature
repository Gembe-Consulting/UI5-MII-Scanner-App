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
		When I look at the screen
		Then I can see quantityInput with value '0,000' in action.GoodsIssue view
		When I enter '00000000109330000004' into storageUnitInput in action.GoodsIssue view
		Then I can see storageUnitFragmentMaterialInfoText with text '1700948-030 - Zucker-Fett-VBT V185 RSPO-MB 600, BB' in action.GoodsIssue view
		 And I can see quantityInput with value '217,321' in action.GoodsIssue view
		 And I can see unitOfMeasureInput with value 'KG' in action.GoodsIssue view
		 And I can see storageUnitFragmentBatchText with text '0109331231' in action.GoodsIssue view
		 And I can see storageUnitFragmentStorageBinText with text 'PRODUKTION' in action.GoodsIssue view
		 And I can see storageUnitFragmentStorageTypeText with text '900' in action.GoodsIssue view
		 And I can see storageUnitFragmentStorageUnitTypeText with text 'Industriepalette' in action.GoodsIssue view
		 And I can see storageUnitFragmentExpirationDateText with text '20.12.2022' in action.GoodsIssue view
	 
	Scenario: Should not override previously entered quantity if LE was entered afterwards
		When I enter '100,000' into quantityInput in action.GoodsIssue view
		 And I enter '00000000109330000004' into storageUnitInput in action.GoodsIssue view
		Then I can see quantityInput with value '100,000' in action.GoodsIssue view
		 And I can see unitOfMeasureInput with value 'KG' in action.GoodsIssue view
		 
	Scenario: Should show warning icon if users enter LE with restricted stock (special stock indicator "S")
		When I enter '00000000109330000007' into storageUnitInput in action.GoodsIssue view
		Then I can see storageUnitFragmentSpecialStockIndicatorText with text 'S' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockIndicatorIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockIndicatorIcon with src 'sap-icon://quality-issue' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockRestrictedIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockRestrictedIcon with src 'sap-icon://locked' in action.GoodsIssue view
		 And I can see specialStockIndicatorIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see specialStockIndicatorIcon with src 'sap-icon://quality-issue' in action.GoodsIssue view
		 And I can see specialStockRestrictedIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see specialStockRestrictedIcon with src 'sap-icon://locked' in action.GoodsIssue view
		 
	Scenario: Should show warning icon if users enter LE with quality stock (special stock indicator "Q")
		When I enter '00000000109330000005' into storageUnitInput in action.GoodsIssue view
		Then I can see storageUnitFragmentSpecialStockIndicatorText with text 'Q' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockIndicatorIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockIndicatorIcon with src 'sap-icon://quality-issue' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockQualityIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see storageUnitFragmentSpecialStockQualityIcon with src 'sap-icon://lab' in action.GoodsIssue view
		 And I can see specialStockIndicatorIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see specialStockIndicatorIcon with src 'sap-icon://quality-issue' in action.GoodsIssue view
		 And I can see specialStockQualityIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see specialStockQualityIcon with src 'sap-icon://lab' in action.GoodsIssue view
		 
	@wip
	Scenario: Should show warning icon if users enter LE with restricted-use stock (nicht frei verwendbar)
		 
	Scenario: Should show warning icon and message if users enter LE with past expiration date
		When I enter '00000000109330000006' into storageUnitInput in action.GoodsIssue view
		Then I can see messageStrip with text 'Achtung: MHD der Charge '0109331231' ist am '20.12.2010' abgelaufen!' in action.GoodsIssue view 
		 And I can see messageStrip with type 'Warning' in action.GoodsIssue view
		 And I can see expirationDateIndicatorIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see expirationDateIndicatorIcon with src 'sap-icon://quality-issue' in action.GoodsIssue view
		 And I can see expirationDateOutOfDateIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see expirationDateOutOfDateIcon with src 'sap-icon://date-time' in action.GoodsIssue view
		 And I can see storageUnitFragmentPastExpirationDateIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see storageUnitFragmentPastExpirationDateIcon with src 'sap-icon://quality-issue' in action.GoodsIssue view
		 And I can see storageUnitFragmentExpirationDateOutOfDateIcon with color '#f9a429' in action.GoodsIssue view
		 And I can see storageUnitFragmentExpirationDateOutOfDateIcon with src 'sap-icon://date-time' in action.GoodsIssue view
		When I enter '1093300' into orderNumberInput in action.GoodsIssue view
		Then I can see saveButton in action.GoodsIssue view

	Scenario: Should show show warning message if users enter a storage unit with material number that is not contained in order component list (Unplanned Withdrawal)
		When I enter '00000000109330000008' into storageUnitInput in action.GoodsIssue view
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		Then I can see storageUnitFragmentMaterialInfoText with text '0000000-000 - UNPLANNED WITHDRAWAL of Zucker-Fett-VBT' in action.GoodsIssue view
		 And I can see messageStrip with text 'Ungeplante Entnahme: Komponente '0000000-000' für Auftrag '1234567' nicht vorgesehen!' in action.GoodsIssue view
		 And I can see messageStrip with type 'Warning' in action.GoodsIssue view
		 And I can see orderNumberInput with valueState 'Warning' in action.GoodsIssue view
		 And I can see saveButton in action.GoodsIssue view
	
	Scenario: Should show warning message if users enter a storage unit with material number that is backflushed in order
		When I enter '00000000109330000009' into storageUnitInput in action.GoodsIssue view
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		Then I can see messageStrip with text 'Achtung: Komponente '1200666-002' wird retrograd entnommen!' in action.GoodsIssue view
		 And I can see messageStrip with type 'Warning' in action.GoodsIssue view
		Then I can see saveButton in action.GoodsIssue view
	
	Scenario: Should show error message if unit of measure from LE does not match unit of measure from order component list
		When I enter '00000000109330000010' into storageUnitInput in action.GoodsIssue view
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		Then I can see messageStrip with text 'Achtung: Inkonsistente Mengeneinheiten in Auftragskomponente (ST) und Lagereinheit (KGM)!' in action.GoodsIssue view
		 And I can see messageStrip with type 'Error' in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
	
	Scenario: Should show error message if entered order number does not exist
		When I enter '00000000100000100011' into storageUnitInput in action.GoodsIssue view
		 And I enter '1000001' into orderNumberInput in action.GoodsIssue view
		Then I can see messageStrip with text 'Achtung: Auftrag '1000001' existiert nicht!' in action.GoodsIssue view
		 And I can see messageStrip with type 'Error' in action.GoodsIssue view
		Then on the Goods Issue Page: I should see the save button is disabled
		
	Scenario: Should show success message if users post goods issue successfully
		When I enter '00000000109330000012' into storageUnitInput in action.GoodsIssue view
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		 And I click on saveButton in action.GoodsIssue view
		Then I can see messageStrip with text 'Warenausgang zu Auftrag '1234567' wurde erfolgreich gebucht!' in action.GoodsIssue view