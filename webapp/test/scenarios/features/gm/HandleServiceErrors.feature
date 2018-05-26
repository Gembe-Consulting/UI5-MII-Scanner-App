Feature: Service calls @ Goods Movements
	Detect and manage errors during service calls
	Structure for non-posting service calls
		1. emptyRequest: service returns empty Rowset (message strip)
		2. error: service returns Fatal Error (mesage stripx2)
		3. badRequest: service not available (message box + message stripx2)
	Structure for posting service calls
		1. error: service returns Fatal Error (mesage strip)
		2. badRequest: service not available (message box + message strip)	

	@Goods Receipt 
	@storageUnit-Service
	Scenario: [WE] Should show error message on empty request at StorageUnitReadXac
	   Given I start the app on '/WE' with 'StorageUnitReadXac' type 'emptyRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Palette '00000000109330000001' nicht gefunden.' in action.gm.GoodsReceipt view
		 And I can see storageUnitInput with valueState 'Error' in action.gm.GoodsReceipt view
	 
	Scenario: [WE] Should show error message on fatal transaction error at StorageUnitReadXac
	   Given I start the app on '/WE' with 'StorageUnitReadXac' error 'Fatal Transaction Error'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitNumberRead'' in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.GoodsReceipt view
		 And I can see storageUnitInput with valueState 'Error' in action.gm.GoodsReceipt view
		 
	Scenario: [WE] Should show error message on bad request at StorageUnitReadXac
	   Given I start the app on '/WE' with 'StorageUnitReadXac' type 'badRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.GoodsReceipt view
		Then I can see the service error with title 'Fehler: requestFailed in storageUnit-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitNumberRead'' in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'StorageUnitReadXac' not available!' in action.gm.GoodsReceipt view
	     And I can see storageUnitInput with valueState 'Error' in action.gm.GoodsReceipt view
	
	@Goods Receipt 
	@orderHeader-Service
	Scenario: [WE] Should show error message on empty request at GetOrderHeaderQry
	   Given I start the app on '/WE' with 'GetOrderHeaderQry' type 'emptyRequest'
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1234567' nicht gefunden.' in action.gm.GoodsReceipt view
		Then I can see orderNumberInput with valueState 'Error' in action.gm.GoodsReceipt view
		
	Scenario: [WE] Should show error message on fatal transaction error at GetOrderHeaderQry
	   Given I start the app on '/WE' with 'GetOrderHeaderQry' error 'Fatal Transaction Error'
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.GoodsReceipt view
		 And I can see orderNumberInput with valueState 'Error' in action.gm.GoodsReceipt view

	Scenario: [WE] Should show error message on bad request at GetOrderHeaderQry
	   Given I start the app on '/WE' with 'GetOrderHeaderQry' type 'badRequest'
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsReceipt view
		Then I can see the service error with title 'Fehler: requestFailed in orderHeader-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'GetOrderHeaderQry' not available!' in action.gm.GoodsReceipt view
	     And I can see orderNumberInput with valueState 'Error' in action.gm.GoodsReceipt view
	
	@Goods Receipt 
	@Posting GR
	Scenario: [WE] Should show error message on posting error
	   Given I start the app on '/WE' with 'GoodsMovementCreateXac' error 'Buchung fehlgeschlagen: Wareneingang nicht gebucht'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.GoodsReceipt view
		 And I click on saveButton in action.gm.GoodsReceipt view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Buchung fehlgeschlagen: Wareneingang nicht gebucht' in action.gm.GoodsReceipt view
	
	Scenario: [WE] Should show error message on posting bad request
	   Given I start the app on '/WE' with 'GoodsMovementCreateXac' type 'badRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.GoodsReceipt view
		 And I click on saveButton in action.gm.GoodsReceipt view
		Then I can see the service error with title 'Fehler: requestFailed in goodsMovement-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'GoodsMovementCreate: 101'' in action.gm.GoodsReceipt view

	@Goods Issue 
	@storageUnit-Service
	Scenario: [WA] Should show error message on empty request at StorageUnitReadXac
	   Given I start the app on '/WA?type=withLE' with 'StorageUnitReadXac' type 'emptyRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Palette '00000000109330000001' nicht gefunden.' in action.gm.GoodsIssue view
		 And I can see storageUnitInput with valueState 'Error' in action.gm.GoodsIssue view

	Scenario: [WA] Should show error message on fatal transaction error at StorageUnitReadXac
	   Given I start the app on '/WA?type=withLE' with 'StorageUnitReadXac' error 'Fatal Transaction Error'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitNumberRead'' in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.GoodsIssue view
		 And I can see storageUnitInput with valueState 'Error' in action.gm.GoodsIssue view
		 
	Scenario: [WA] Should show error message on bad request at StorageUnitReadXac
	   Given I start the app on '/WA?type=withLE' with 'StorageUnitReadXac' type 'badRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.GoodsIssue view
		Then I can see the service error with title 'Fehler: requestFailed in storageUnit-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitNumberRead'' in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'StorageUnitReadXac' not available!' in action.gm.GoodsIssue view
	     And I can see storageUnitInput with valueState 'Error' in action.gm.GoodsIssue view

	@Goods Issue 
	@orderHeader-Service
	Scenario: [WA] Should show error message on empty request at GetOrderHeaderQry
	   Given I start the app on '/WA?type=withLE' with 'GetOrderHeaderQry' type 'emptyRequest'
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Prozessauftrag '1234567' nicht gefunden.' in action.gm.GoodsIssue view
		 And I can see orderNumberInput with valueState 'Error' in action.gm.GoodsIssue view

	Scenario: [WA] Should show error message on fatal transaction error at GetOrderHeaderQry
	   Given I start the app on '/WA?type=withLE' with 'GetOrderHeaderQry' error 'Fatal Transaction Error'
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.GoodsIssue view
		 And I can see orderNumberInput with valueState 'Error' in action.gm.GoodsIssue view
		 
	Scenario: [WA] Should show error message on bad request at GetOrderHeaderQry
	   Given I start the app on '/WA?type=withLE' with 'GetOrderHeaderQry' type 'badRequest'
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		Then I can see the service error with title 'Fehler: requestFailed in orderHeader-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'OrderHeaderNumberRead'' in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'GetOrderHeaderQry' not available!' in action.gm.GoodsIssue view
	     And I can see orderNumberInput with valueState 'Error' in action.gm.GoodsIssue view
		    
	@Goods Issue
	@orderComponent-Service
	Scenario: [WA] Should show error message on fatal transaction error at GetOrderComponentQry
	   Given I start the app on '/WA?type=nonLE' with 'GetOrderComponentQry' error 'Fatal Transaction Error'
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		 And I enter '1200666-004' into materialNumberInput in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'OrderComponentRead'' in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.GoodsIssue view
		 And I can see materialNumberInput with valueState 'Error' in action.gm.GoodsIssue view

	Scenario: [WA] Should show error message on bad request at GetOrderComponentQry
	   Given I start the app on '/WA?type=nonLE' with 'GetOrderComponentQry' type 'badRequest'
		 And I enter '1234567' into orderNumberInput in action.gm.GoodsIssue view
		 And I enter '1200666-004' into materialNumberInput in action.gm.GoodsIssue view
		Then I can see the service error with title 'Fehler: requestFailed in orderComponent-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'OrderComponentRead'' in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'GetOrderComponentQry' not available!' in action.gm.GoodsIssue view
	     And I can see materialNumberInput with valueState 'Error' in action.gm.GoodsIssue view

	@Goods Issue 
	@Posting GI
	Scenario: [WA] Should show error message on posting error
	   Given I start the app on '/WA?type=withLE' with 'GoodsMovementCreateXac' error 'Buchung fehlgeschlagen: Warenausgang nicht gebucht'
		 And I enter '109330000004' into storageUnitInput in action.gm.GoodsIssue view
		 And I enter '1093300' into orderNumberInput in action.gm.GoodsIssue view
		 And I click on saveButton in action.gm.GoodsIssue view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Buchung fehlgeschlagen: Warenausgang nicht gebucht' in action.gm.GoodsIssue view	
	
	Scenario: [WA] Should show error message on posting bad request
	   Given I start the app on '/WA?type=withLE' with 'GoodsMovementCreateXac' type 'badRequest'
		 And I enter '109330000004' into storageUnitInput in action.gm.GoodsIssue view
		 And I enter '1093300' into orderNumberInput in action.gm.GoodsIssue view
		 And I click on saveButton in action.gm.GoodsIssue view
		Then I can see the service error with title 'Fehler: requestFailed in goodsMovement-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'GoodsMovementCreate: 261'' in action.gm.GoodsIssue view
		
	@Stock Transfer
	@storageUnit-Service
	Scenario: [UML] Should show error message on empty request at StorageUnitReadXac
	   Given I start the app on '/UML' with 'StorageUnitReadXac' type 'emptyRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.StockTransfer view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Palette '00000000109330000001' nicht gefunden.' in action.gm.StockTransfer view
		 And I can see storageUnitInput with valueState 'Error' in action.gm.StockTransfer view

	Scenario: [UML] Should show error message on fatal transaction error at StorageUnitReadXac
	   Given I start the app on '/UML' with 'StorageUnitReadXac' error 'Fatal Transaction Error'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.StockTransfer view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitNumberRead'' in action.gm.StockTransfer view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.StockTransfer view
		 And I can see storageUnitInput with valueState 'Error' in action.gm.StockTransfer view
		 
	Scenario: [UML] Should show error message on bad request at StorageUnitReadXac
	   Given I start the app on '/UML' with 'StorageUnitReadXac' type 'badRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.StockTransfer view
		Then I can see the service error with title 'Fehler: requestFailed in storageUnit-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitNumberRead'' in action.gm.StockTransfer view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'StorageUnitReadXac' not available!' in action.gm.StockTransfer view
	     And I can see storageUnitInput with valueState 'Error' in action.gm.StockTransfer view
	
	@Stock Transfer
	@Posting UML 
	@fullLE
	Scenario: [UML]@full Should show error message on posting error
	   Given I start the app on '/UML' with 'GoodsMovementCreateXac' error 'Buchung fehlgeschlagen: Umlagerung nicht gebucht'
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.StockTransfer view
		 And I click on 3rd item of storageBinSelection items in action.gm.StockTransfer view
		 And I enter '00000000109330000014' into storageUnitInput in action.gm.StockTransfer view
		 And I click on saveButton in action.gm.StockTransfer view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Buchung fehlgeschlagen: Umlagerung nicht gebucht @BwA 999' in action.gm.StockTransfer view	
	
	Scenario: [UML]@full Should show error message on posting bad request
	   Given I start the app on '/UML' with 'GoodsMovementCreateXac' type 'badRequest'
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.StockTransfer view
		 And I click on 3rd item of storageBinSelection items in action.gm.StockTransfer view
		 And I enter '00000000109330000014' into storageUnitInput in action.gm.StockTransfer view
		 And I click on saveButton in action.gm.StockTransfer view
		Then I can see the service error with title 'Fehler: requestFailed in goodsMovement-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'GoodsMovementCreate @BwA 999'' in action.gm.StockTransfer view
	
	@Stock Transfer
	@Posting UML 
	@emptyLE
	Scenario: [UML]@empty Should show error message on posting error
	   Given I start the app on '/UML' with 'GoodsMovementCreateXac' error 'Buchung fehlgeschlagen: Wareneingang nicht gebucht'
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.StockTransfer view
		 And I click on 3rd item of storageBinSelection items in action.gm.StockTransfer view
		 And I enter '00000000109330000013' into storageUnitInput in action.gm.StockTransfer view
		 And I enter '10' into quantityInput in action.gm.StockTransfer view
		 And I click on saveButton in action.gm.StockTransfer view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Buchung fehlgeschlagen: Wareneingang nicht gebucht @BwA 101' in action.gm.StockTransfer view	
	
	Scenario: [UML]@empty Should show error message on posting bad request
	   Given I start the app on '/UML' with 'GoodsMovementCreateXac' type 'badRequest'
		 And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.StockTransfer view
		 And I click on 3rd item of storageBinSelection items in action.gm.StockTransfer view
		 And I enter '00000000109330000013' into storageUnitInput in action.gm.StockTransfer view
		 And I enter '10' into quantityInput in action.gm.StockTransfer view
		 And I click on saveButton in action.gm.StockTransfer view
		Then I can see the service error with title 'Fehler: requestFailed in goodsMovement-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'GoodsMovementCreate @BwA 999'' in action.gm.StockTransfer view
		
	@Roller Conveyor
	@storageUnit-Service
	Scenario: [ROL] Should show error message on empty request at StorageUnitReadXac
	   Given I start the app on '/ROL' with 'StorageUnitReadXac' type 'emptyRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Palette '00000000109330000001' nicht gefunden.' in action.gm.RollerConveyor view
		 And I can see storageUnitInput with valueState 'Error' in action.gm.RollerConveyor view

	Scenario: [ROL] Should show error message on fatal transaction error at StorageUnitReadXac
	   Given I start the app on '/ROL' with 'StorageUnitReadXac' error 'Fatal Transaction Error'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitNumberRead'' in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.RollerConveyor view
		 And I can see storageUnitInput with valueState 'Error' in action.gm.RollerConveyor view
		 
	Scenario: [ROL] Should show error message on bad request at StorageUnitReadXac
	   Given I start the app on '/ROL' with 'StorageUnitReadXac' type 'badRequest'
		 And I enter '00000000109330000001' into storageUnitInput in action.gm.RollerConveyor view
		Then I can see the service error with title 'Fehler: requestFailed in storageUnit-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitNumberRead'' in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'StorageUnitReadXac' not available!' in action.gm.RollerConveyor view
	     And I can see storageUnitInput with valueState 'Error' in action.gm.RollerConveyor view

	@Roller Conveyor
	@currentProcessOrder-Service
	Scenario: [ROL] Should show error message on empty request at GetCurrentProcessOrderQry
	   Given I start the app on '/ROL' with 'GetCurrentProcessOrderQry' type 'emptyRequest'
		 And I enter '90024811000000000000' into storageUnitInput in action.gm.RollerConveyor view
		 And I enter '10' into quantityInput in action.gm.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.gm.RollerConveyor view
		When I click on saveButton in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Der aktuell laufende Prozessauftrag auf Ressource '00248110' konnte nicht eindeutig bestimmt werden!' in action.gm.RollerConveyor view

	Scenario: [ROL] Should show error message on fatal transaction error at GetCurrentProcessOrderQry
	   Given I start the app on '/ROL' with 'GetCurrentProcessOrderQry' error 'Fatal Transaction Error'
		 And I enter '90024811000000000000' into storageUnitInput in action.gm.RollerConveyor view
		 And I enter '10' into quantityInput in action.gm.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.gm.RollerConveyor view
		When I click on saveButton in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'CurrentProcessOrderRead'' in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.RollerConveyor view
		 
	Scenario: [ROL] Should show error message on bad request at GetCurrentProcessOrderQry
	   Given I start the app on '/ROL' with 'GetCurrentProcessOrderQry' type 'badRequest'
		 And I enter '90024811000000000000' into storageUnitInput in action.gm.RollerConveyor view
		 And I enter '10' into quantityInput in action.gm.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.gm.RollerConveyor view
		When I click on saveButton in action.gm.RollerConveyor view
		Then I can see the service error with title 'Fehler: requestFailed in currentProcessOrder-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
		When I close all service error message boxes
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'CurrentProcessOrderRead'' in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'GetCurrentProcessOrderQry' not available!' in action.gm.RollerConveyor view

	@Roller Conveyor
	@Posting ROL 
	@fullLE @non-dummy
	Scenario: [ROL]@full Should show error message on posting error StorageUnitCreateXac
		Given I start the app on '/ROL' with 'StorageUnitCreateXac' error 'Fatal Transaction Error'
		  And I enter '00000000109330000016' into storageUnitInput in action.gm.RollerConveyor view
		  And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.RollerConveyor view
		  And I click on 3rd item of storageBinSelection items in action.gm.RollerConveyor view
		  And I click on saveButton in action.gm.RollerConveyor view
		 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitCreate'' in action.gm.RollerConveyor view
		 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error' in action.gm.RollerConveyor view

	Scenario: [ROL]@full Should show error message on posting bad request StorageUnitCreateXac
		Given I start the app on '/ROL' with 'StorageUnitCreateXac' type 'badRequest'
		  And I enter '00000000109330000016' into storageUnitInput in action.gm.RollerConveyor view
		  And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.RollerConveyor view
		  And I click on 3rd item of storageBinSelection items in action.gm.RollerConveyor view
		  And I click on saveButton in action.gm.RollerConveyor view
		 Then I can see the service error with title 'Fehler: requestFailed in storageUnitCreate-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
	 	 When I close all service error message boxes
		 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'StorageUnitCreate' in action.gm.RollerConveyor view
	 	 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'StorageUnitCreateXac' not available!' in action.gm.RollerConveyor view
	 
	@Roller Conveyor
	@Posting ROL 
	@emptyLE @non-dummy
	Scenario: [ROL]@empty Should show error message on posting error GoodsMovementCreateXac
		Given I start the app on '/ROL' with 'GoodsMovementCreateXac' error 'Fatal Transaction Error'
		  And I enter '00000000109330000015' into storageUnitInput in action.gm.RollerConveyor view
		  And I enter '10' into quantityInput in action.gm.RollerConveyor view 
		  And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.RollerConveyor view
		  And I click on 3rd item of storageBinSelection items in action.gm.RollerConveyor view
		  And I click on saveButton in action.gm.RollerConveyor view
		 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error @BwA 101' in action.gm.RollerConveyor view

	Scenario: [ROL]@empty Should show error message on posting bad request GoodsMovementCreateXac
		Given I start the app on '/ROL' with 'GoodsMovementCreateXac' type 'badRequest'
		  And I enter '00000000109330000015' into storageUnitInput in action.gm.RollerConveyor view
		  And I enter '10' into quantityInput in action.gm.RollerConveyor view 
		  And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.RollerConveyor view
		  And I click on 3rd item of storageBinSelection items in action.gm.RollerConveyor view
		  And I click on saveButton in action.gm.RollerConveyor view
		 Then I can see the service error with title 'Fehler: requestFailed in goodsMovement-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
	 	 When I close all service error message boxes
		 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'GoodsMovementCreate @BwA 101'' in action.gm.RollerConveyor view
	 	 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'GoodsMovementCreateXac' not available!' in action.gm.RollerConveyor view

	Scenario: [ROL]@empty Should show error message on posting empty request GoodsMovementCreateXac
		Given I start the app on '/ROL' with 'GoodsMovementCreateXac' type 'emptyRequest'
		  And I enter '00000000109330000015' into storageUnitInput in action.gm.RollerConveyor view
		  And I enter '10' into quantityInput in action.gm.RollerConveyor view 
		  And I press ARROW_DOWN + ALT at storageBinSelection in action.gm.RollerConveyor view
		  And I click on 3rd item of storageBinSelection items in action.gm.RollerConveyor view
		  And I click on saveButton in action.gm.RollerConveyor view
		 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Die Transaktion hat keine LE zurückgegeben @BwA 101' in action.gm.RollerConveyor view
	 	 
	@Roller Conveyor
	@Posting ROL 
	@dummyLE
	Scenario: [ROL]@dummy Should show error message on posting error GoodsMovementRollerConveyorCreateXac
	   Given I start the app on '/ROL' with 'GoodsMovementRollerConveyorCreateXac' error 'Fatal Transaction Error'
		 And I enter '90024811000000000000' into storageUnitInput in action.gm.RollerConveyor view
		 And I enter '10' into quantityInput in action.gm.RollerConveyor view
		 And I enter 'KG' into unitOfMeasureInput in action.gm.RollerConveyor view
	     And I click on saveButton in action.gm.RollerConveyor view
		Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fatal Transaction Error @BwA 555' in action.gm.RollerConveyor view

	Scenario: [ROL]@dummy Should show error message on posting bad request GoodsMovementRollerConveyorCreateXac
		Given I start the app on '/ROL' with 'GoodsMovementRollerConveyorCreateXac' type 'badRequest'
		  And I enter '90024811000000000000' into storageUnitInput in action.gm.RollerConveyor view
		  And I enter '10' into quantityInput in action.gm.RollerConveyor view
		  And I enter 'KG' into unitOfMeasureInput in action.gm.RollerConveyor view
		  And I click on saveButton in action.gm.RollerConveyor view
		 Then I can see the service error with title 'Fehler: requestFailed in goodsMovementRollerConveyor-Service' and message 'Entschuldigung, ein technischer Fehler ist aufgetreten. Bitte versuchen sie es noch einmal.Details anzeigen'
	 	 When I close all service error message boxes
		 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Fehler in MII Transaktion 'GoodsMovementRollerConveyorCreate @BwA 555'' in action.gm.RollerConveyor view
	 	 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Mockserver response: errorService 'GoodsMovementRollerConveyorCreateXac' not available!' in action.gm.RollerConveyor view

	Scenario: [ROL]@dummy Should show error message on posting empty request GoodsMovementRollerConveyorCreateXac
		Given I start the app on '/ROL' with 'GoodsMovementRollerConveyorCreateXac' type 'emptyRequest'
		  And I enter '90024811000000000000' into storageUnitInput in action.gm.RollerConveyor view
		  And I enter '10' into quantityInput in action.gm.RollerConveyor view
		  And I enter 'KG' into unitOfMeasureInput in action.gm.RollerConveyor view
		  And I click on saveButton in action.gm.RollerConveyor view
		 Then I can see the first sap.m.MessageStrip control directly nested inside messageStripContainer with text starting with 'Die Transaktion hat keine LE zurückgegeben @BwA 555' in action.gm.RollerConveyor view