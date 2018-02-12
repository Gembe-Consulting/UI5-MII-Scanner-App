Feature: Determinate Input Fields from an external Application
	Users can call a deep Link to this app, providing query parameters.
	The app will pre-populate the given input fields with the provided data.
	
	Scenario: Should open Goods Receipt Page with given storage unit number
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WE?LENUM=00000000109330000001"
		Then I can see storageUnitInput with value '109330000001' in action.GoodsReceipt view
		 And I can see storageLocationInput with value '1000' in action.GoodsReceipt view
	
	Scenario: Should open Goods Receipt Page with given order number
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WE?AUFNR=1234567"
		Then I can see orderNumberInput with value '1234567' in action.GoodsReceipt view
		
	Scenario: Should open Goods Receipt Page with given storage location
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WE?LGORT=RB01"
		Then I can see storageLocationInput with value 'RB01' in action.GoodsReceipt view
		 And I can see storageUnitInput with editable being 'false' in action.GoodsReceipt view
		When I navigate to "/WE?LGORT=1000"
		Then I can see storageLocationInput with value '1000' in action.GoodsReceipt view
		 And I can see storageUnitInput with editable being 'true' in action.GoodsReceipt view

	Scenario: Should open Goods Receipt Page with given unit of measure
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WE?MEINH=ST"
		Then I can see unitOfMeasureInput with value 'ST' in action.GoodsReceipt view
		
	Scenario: Should open Goods Issue Page (withLE) with given order number
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=withLE&AUFNR=1234567"
		Then I can see orderNumberInput with value '1234567' in action.GoodsIssue view
		
	Scenario: Should open Goods Issue Page (withLE) with given storage unit number
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=withLE&LENUM=00000000109330000004"
		Then I can see storageUnitInput with value '00000000109330000004' in action.GoodsIssue view
		 And I can see storageUnitFragmentBatchText with text '0109331231' in action.GoodsIssue view
		
	Scenario: Should open Goods Issue Page (withLE) with all possible input values
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=withLE&LENUM=00000000109330000004&AUFNR=1234567"
		Then I can see storageUnitInput with value '00000000109330000004' in action.GoodsIssue view
		 And I can see orderNumberInput with value '1234567' in action.GoodsIssue view
		 And I can see storageUnitFragmentBatchText with text '0109331231' in action.GoodsIssue view
		 
	Scenario: Should open Goods Issue Page (nonLE) with given order number
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=nonLE&AUFNR=1234567"
		Then I can see orderNumberInput with value '1234567' in action.GoodsIssue view
		
	Scenario: Should open Goods Issue Page (nonLE) with given material number
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=nonLE&MATNR=1200666-001"
		Then I can see materialNumberInput with value '1200666-001' in action.GoodsIssue view
		
	Scenario: Should open Goods Issue Page (nonLE) with given storage location
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=nonLE&LGORT=RB01"
		Then I can see storageLocationInput with value 'RB01' in action.GoodsIssue view

	Scenario: Should open Goods Issue Page (nonLE) with given unit of measure
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=nonLE&MEINH=KG"
		Then I can see unitOfMeasureInput with value 'KG' in action.GoodsIssue view
		
	Scenario: Should open Goods Issue Page (nonLE) with given bulk material indicator
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=nonLE&SCHGT=true"
		Then I can see bulkMaterialSwitch with state being 'true' in action.GoodsIssue view
		
	Scenario: Should open Goods Issue Page (nonLE) with all possible input values
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I navigate to "/WA?type=nonLE&SCHGT=true&AUFNR=1234567&MATNR=1200666-006&LGORT=RB01&MEINH=KG"
		Then I can see bulkMaterialSwitch with state being 'true' in action.GoodsIssue view
		 And I can see orderNumberInput with value '1234567' in action.GoodsIssue view
		 And I can see materialNumberInput with value '1200666-006' in action.GoodsIssue view
		 And I can see storageLocationInput with value 'RB01' in action.GoodsIssue view
		 And I can see unitOfMeasureInput with value 'KG' in action.GoodsIssue view