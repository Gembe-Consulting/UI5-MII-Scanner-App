Feature: Navigation between pages with correct labels
	
	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
	
	Scenario: Should show start page
		When I navigate to "/Start"
		Then I can see the sap.m.Label control deeply nested inside navGoodsMovementItem with text 'Materialbewegungen' in nav.Home view
		Then I can see the sap.ui.core.Icon control deeply nested inside navGoodsMovementItem with color '#330066' in nav.Home view
		Then I can see the sap.ui.core.Icon control deeply nested inside navGoodsMovementItem with src 'sap-icon://product' in nav.Home view
		Then I can see the sap.m.Label control deeply nested inside navStatusChangeItem with text 'Statusmeldungen' in nav.Home view
		Then I can see the sap.ui.core.Icon control deeply nested inside navStatusChangeItem with color '#007700' in nav.Home view
		Then I can see the sap.ui.core.Icon control deeply nested inside navStatusChangeItem with src 'sap-icon://journey-change' in nav.Home view
		
	Scenario: Should show goods movement page
		When I navigate to "/Start/Materialbewegung"
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