Feature: Detect and show error messages during service calls

	@Goods Receipt 
	@storageUnit-Service
	Scenario: [WE] Should show error message on fatal transaction error at StorageUnitReadXac
	   Given I start the app on '/WE' with 'StorageUnitReadXac' error 'Fatal Transaction Error'
		 And I enter '00000000109330000001' into storageUnitInput in action.GoodsReceipt view
		 And I can see the service error with title 'Fehler in MII Transaktion 'StorageUnitNumberRead'' and message 'Fatal Transaction Error'
		 And I close all service error message boxes
		Then I can see storageUnitInput in action.GoodsReceipt view

	Scenario: [WE] Should show error message on empty request at StorageUnitReadXac
	   Given I start the app on '/WE' with 'StorageUnitReadXac' type 'emptyRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.GoodsReceipt view
		 And I can see the service error with title 'Fehler in MII Transaktion 'StorageUnitNumberRead'' and message 'TypeError: Cannot read property 'results' of undefined'
		 And I close all service error message boxes
		Then I can see storageUnitInput in action.GoodsReceipt view
		 
	Scenario: [WE] Should show error message on bad request at StorageUnitReadXac
	   Given I start the app on '/WE' with 'StorageUnitReadXac' type 'badRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.GoodsReceipt view
		 And I can see the service error with title 'Fehler in MII Transaktion 'StorageUnitNumberRead'' and message 'Mockserver response: errorService 'StorageUnitReadXac' not available!'
		 And I can see the service error with title 'Fehler: requestFailed in storageUnit-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		 And I close all service error message boxes
	    Then I can see storageUnitInput in action.GoodsReceipt view
	
	@Goods Receipt 
	@orderHeader-Service
	Scenario: [WE] Should show error message on fatal transaction error at GetOrderHeaderQry
	   Given I start the app on '/WE' with 'GetOrderHeaderQry' error 'Fatal Transaction Error'
		 And I enter '1234567' into orderNumberInput in action.GoodsReceipt view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' and message 'Fatal Transaction Error'
		 And I close all service error message boxes
		Then I can see orderNumberInput in action.GoodsReceipt view

	Scenario: [WE] Should show error message on empty request at GetOrderHeaderQry
	   Given I start the app on '/WE' with 'GetOrderHeaderQry' type 'emptyRequest'
		 And I enter '1234567' into orderNumberInput in action.GoodsReceipt view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' and message 'TypeError: Cannot read property 'results' of undefined'
		 And I close all service error message boxes
		Then I can see orderNumberInput in action.GoodsReceipt view
		
	Scenario: [WE] Should show error message on bad request at GetOrderHeaderQry
	   Given I start the app on '/WE' with 'GetOrderHeaderQry' type 'badRequest'
		 And I enter '1234567' into orderNumberInput in action.GoodsReceipt view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' and message 'Mockserver response: errorService 'GetOrderHeaderQry' not available!'
		 And I can see the service error with title 'Fehler: requestFailed in orderHeader-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		 And I close all service error message boxes
	    Then I can see orderNumberInput in action.GoodsReceipt view
	
	@Goods Receipt 
	@Posting GR
#	Scenario: [WE] Should show error message on posting error
	
	@Goods Issue 
	@storageUnit-Service
	Scenario: [WA] Should show error message on fatal transaction error at StorageUnitReadXac
	   Given I start the app on '/WA?type=withLE' with 'StorageUnitReadXac' error 'Fatal Transaction Error'
		 And I enter '00000000109330000001' into storageUnitInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'StorageUnitNumberRead'' and message 'Fatal Transaction Error'
		 And I close all service error message boxes
		Then I can see storageUnitInput in action.GoodsIssue view

	Scenario: [WA] Should show error message on empty request at StorageUnitReadXac
	   Given I start the app on '/WA?type=withLE' with 'StorageUnitReadXac' type 'emptyRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'StorageUnitNumberRead'' and message 'TypeError: Cannot read property 'results' of undefined'
		 And I close all service error message boxes
		Then I can see storageUnitInput in action.GoodsIssue view
		 
	Scenario: [WA] Should show error message on bad request at StorageUnitReadXac
	   Given I start the app on '/WA?type=withLE' with 'StorageUnitReadXac' type 'badRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'StorageUnitNumberRead'' and message 'Mockserver response: errorService 'StorageUnitReadXac' not available!'
		 And I can see the service error with title 'Fehler: requestFailed in storageUnit-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		 And I close all service error message boxes
	    Then I can see storageUnitInput in action.GoodsIssue view


	@Goods Issue 
	@orderHeader-Service
	Scenario: [WA] Should show error message on fatal transaction error at GetOrderHeaderQry
	   Given I start the app on '//WA?type=withLE' with 'GetOrderHeaderQry' error 'Fatal Transaction Error'
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' and message 'Fatal Transaction Error'
		 And I close all service error message boxes
		Then I can see orderNumberInput in action.GoodsIssue view

	Scenario: [WA] Should show error message on empty request at GetOrderHeaderQry
	   Given I start the app on '//WA?type=withLE' with 'GetOrderHeaderQry' type 'emptyRequest'
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' and message 'TypeError: Cannot read property 'results' of undefined'
		 And I close all service error message boxes
		Then I can see orderNumberInput in action.GoodsIssue view
		
	Scenario: [WA] Should show error message on bad request at GetOrderHeaderQry
	   Given I start the app on '//WA?type=withLE' with 'GetOrderHeaderQry' type 'badRequest'
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' and message 'Mockserver response: errorService 'GetOrderHeaderQry' not available!'
		 And I can see the service error with title 'Fehler: requestFailed in orderHeader-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		 And I close all service error message boxes
	    Then I can see orderNumberInput in action.GoodsIssue view
		    
	@Goods Issue
	@orderComponent-Service
	Scenario: [WA] Should show error message on fatal transaction error at GetOrderComponentQry
	   Given I start the app on '/WA?type=nonLE' with 'GetOrderComponentQry' error 'Fatal Transaction Error'
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		 And I enter '1200666-004' into materialNumberInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderComponentRead'' and message 'Fatal Transaction Error'
		 And I close all service error message boxes
		Then I can see orderNumberInput in action.GoodsIssue view

	Scenario: [WA] Should show error message on empty request at GetOrderComponentQry
	   Given I start the app on '/WA?type=nonLE' with 'GetOrderComponentQry' type 'emptyRequest'
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		 And I enter '1200666-004' into materialNumberInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderComponentRead'' and message 'TypeError: Cannot read property 'results' of undefined'
		 And I close all service error message boxes
		Then I can see orderNumberInput in action.GoodsIssue view
		
	Scenario: [WA] Should show error message on bad request at GetOrderComponentQry
	   Given I start the app on '/WA?type=nonLE' with 'GetOrderComponentQry' type 'badRequest'
		 And I enter '1234567' into orderNumberInput in action.GoodsIssue view
		 And I enter '1200666-004' into materialNumberInput in action.GoodsIssue view
		 And I can see the service error with title 'Fehler in MII Transaktion 'OrderComponentRead'' and message 'Mockserver response: errorService 'GetOrderComponentQry' not available!'
		 And I can see the service error with title 'Fehler: requestFailed in orderComponent-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		 And I close all service error message boxes
	    Then I can see orderNumberInput in action.GoodsIssue view
	    
	@Goods Issue 
	@Posting GI
#	Scenario: [WA] Should show error message on posting error
	
	@Goods Issue
#	Scenario: [WA] Should show error message, if users enter unknown order component or service is not available
	
	@Goods Issue
#	Scenario: [WA] Should show error message, if users posting returns a fatal error or service is not available
	
	@Stock Transfer
#	Scenario: [UML] Should show error message, if users enter unknown storage unit number or service is not available
	
	@Stock Transfer
#	Scenario: [UML] Should show error message, if users posting returns a fatal error or service is not available
	
	@Roller Conveyor
#	Scenario: [ROL] Should show error message, if users enter unknown storage unit number or service is not available
	
	@Roller Conveyor
#	Scenario: [ROL] Should show error message, if users enter dummy unit and backand cannot find process order or service is not available
	
	@Roller Conveyor
#	Scenario: [ROL] Should show error message, if users posting returns a fatal error or service is not available