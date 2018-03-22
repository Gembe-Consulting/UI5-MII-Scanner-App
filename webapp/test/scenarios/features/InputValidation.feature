Feature: Detect and show error messages during service calls

	Background:
		Given I start the app from 'com/mii/scanner/app/mockServer.html'
	
	@Goods Receipt
	Scenario: [WE] Should show error message, if users enter unknown storage unit number or service is not available
	
	@Goods Receipt
	Scenario: [WE] Should show error message, if users enter unknown order number or service is not available
	
	@Goods Receipt
	Scenario: [WE] Should show error message, if users posting returns a fatal error or service is not available
	
	@Goods Issue
	Scenario: [WA] Should show error message, if users enter unknown storage unit number or service is not available
	
	@Goods Issue
	Scenario: [WA] Should show error message, if users enter unknown order number or service is not available
	
	@Goods Issue
	Scenario: [WA] Should show error message, if users enter unknown order component or service is not available
	
	@Goods Issue
	Scenario: [WA] Should show error message, if users posting returns a fatal error or service is not available
	
	@Stock Transfer
	Scenario: [UML] Should show error message, if users enter unknown storage unit number or service is not available
	
	@Stock Transfer
	Scenario: [UML] Should show error message, if users posting returns a fatal error or service is not available
	
	@Roller Conveyor
	Scenario: [ROL] Should show error message, if users enter unknown storage unit number or service is not available
	
	@Roller Conveyor
	Scenario: [ROL] Should show error message, if users enter dummy unit and backand cannot find process order or service is not available
	
	@Roller Conveyor
	Scenario: [ROL] Should show error message, if users posting returns a fatal error or service is not available