Feature: Navigation between pages
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
	
	Scenario: Should show start page
		When I navigate to /Start
		Then I can see the sap.m.Label control deeply nested inside navGoodsMovementItem with text 'Materialbewegungen' in nav.Home view
		Then I can see the sap.ui.core.Icon control deeply nested inside navGoodsMovementItem with color '#330066' in nav.Home view
		Then I can see the sap.ui.core.Icon control deeply nested inside navGoodsMovementItem with src 'sap-icon://product' in nav.Home view
		Then I can see the sap.m.Label control deeply nested inside navStatusChangeItem with text 'Statusmeldungen' in nav.Home view
		Then I can see the sap.ui.core.Icon control deeply nested inside navStatusChangeItem with color '#007700' in nav.Home view
		Then I can see the sap.ui.core.Icon control deeply nested inside navStatusChangeItem with src 'sap-icon://journey-change' in nav.Home view
		
	Scenario: Should show goods movement page
		When I navigate to /Materialbewegung
		Then I can see the sap.m.Label control deeply nested inside goodsReceiptItem with text 'WE' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside goodsReceiptItem with color '#1F35DE' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside goodsReceiptItem with src 'sap-icon://inbox' in nav.GoodsMovement view
		Then I can see the sap.m.Label control deeply nested inside goodsIssueWithLEItem with text 'WA mit LE' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside goodsIssueWithLEItem with color '#BB07FF' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside goodsIssueWithLEItem with src 'sap-icon://outbox' in nav.GoodsMovement view
		Then I can see the sap.m.Label control deeply nested inside goodsIssueNonLEItem with text 'WA ohne LE' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside goodsIssueNonLEItem with color '#BB07FF' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside goodsIssueNonLEItem with src 'sap-icon://outbox' in nav.GoodsMovement view
		Then I can see the sap.m.Label control deeply nested inside rollerConveyorItem with text 'Rollenbahn' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside rollerConveyorItem with color '#05B074' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside rollerConveyorItem with src 'sap-icon://instance' in nav.GoodsMovement view
		Then I can see the sap.m.Label control deeply nested inside stockTransferItem with text 'Umlagerung' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside stockTransferItem with color '#FFAC00' in nav.GoodsMovement view
		Then I can see the sap.ui.core.Icon control deeply nested inside stockTransferItem with src 'sap-icon://offsite-work' in nav.GoodsMovement view
		
	Scenario: Should allow confirmless cancel if data has not changed
		When I navigate to /Materialbewegung
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on goodsReceiptItem in nav.GoodsMovement view
		 And I click on cancelButton in action.GoodsReceipt view
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on goodsIssueWithLEItem in nav.GoodsMovement view
		 And I click on cancelButton in action.GoodsIssue view
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on goodsIssueNonLEItem in nav.GoodsMovement view
		 And I click on cancelButton in action.GoodsIssue view
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on rollerConveyorItem in nav.GoodsMovement view
		 And I click on cancelButton in action.RollerConveyor view
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on stockTransferItem in nav.GoodsMovement view
		 And I click on cancelButton in action.StockTransfer view
		Then I can see goodsMovementPage in nav.GoodsMovement view
		
	Scenario: Should show confirmation message on cancel if data has been changed
		When I navigate to /Materialbewegung
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on goodsReceiptItem in nav.GoodsMovement view
		 And I enter '1' into quantityInput in action.GoodsReceipt view
		 And I click on cancelButton in action.GoodsReceipt view
		When on the Goods Receipt Page: I confirm the message box
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on goodsIssueWithLEItem in nav.GoodsMovement view
		 And I enter '1' into quantityInput in action.GoodsIssue view
		 And I click on cancelButton in action.GoodsIssue view
		When on the Goods Issue Page: I confirm the message box
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on goodsIssueNonLEItem in nav.GoodsMovement view
		 And I enter '1' into quantityInput in action.GoodsIssue view
		 And I click on cancelButton in action.GoodsIssue view
		When on the Goods Issue Page: I confirm the message box
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on rollerConveyorItem in nav.GoodsMovement view
		 And I enter '1' into quantityInput in action.RollerConveyor view
		 And I click on cancelButton in action.RollerConveyor view
		When on the Roller Conveyor Page: I confirm the message box
		Then I can see goodsMovementPage in nav.GoodsMovement view
		When I click on stockTransferItem in nav.GoodsMovement view
		 And I enter '1' into quantityInput in action.StockTransfer view
		 And I click on cancelButton in action.StockTransfer view
		When on the Stock Transfer Page: I confirm the message box
		Then I can see goodsMovementPage in nav.GoodsMovement view