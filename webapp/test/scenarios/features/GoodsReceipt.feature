Feature: Creating goods receipt posting to SAP ERP
	Users can post GRs by entering storage bin number (aka palette) to post a quantity.
	Users also can post GRs by entering order number, quantity and storage location.
	Entering a storage bin number, will show the neccessarry data of that storage bin,
	and prepopulate some input fields.
	
	Background
		Given I start the app from "../mockServer.html"
		When I enter "phigem" into usernameInput in Login view
		And I click on loginButton in Login view
		And I click on navGoodsMovementItem in nav.Home view
		
	Scenario: Should navigate to Goods Receipt Page and see all UI elements
		Then I see goodsReceiptPage in action.GoodsReceipt view