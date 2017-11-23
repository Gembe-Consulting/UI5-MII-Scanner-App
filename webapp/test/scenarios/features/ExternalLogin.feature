Feature: External Login using deep linking
	Users can login from an external application by passing 
	URL parameter "illumLoginName" and the desired hash.
	The app should check if the user exists and redirect to the desired page.
	If the user does not exists, he should be redirected to login page.
	
	Scenario: User can perform login and open deep page homepage
		Given I start the app on "/Start" using remote user "phigem"
		When I look at the screen
		Then I can see homePage in nav.Home view
		
	Scenario: User can perform login and open deep page for goods movement
		Given I start the app on "/Start/Materialbewegung" using remote user "phigem"
		When I look at the screen
		Then I can see goodsMovementPage in nav.GoodsMovement view
		
	Scenario: User can perform login and open deep page status change
		Given I start the app on "/Start/Statusmeldung" using remote user "phigem"
		When I look at the screen
		Then I can see statusChangePage in nav.StatusChange view
		
	Scenario: User can perform login and open deep page for goods recipt
		Given I start the app on "/Start/Materialbewegung/WE" using remote user "phigem"
		When I look at the screen
		Then I can see goodsReceiptPage in action.GoodsReceipt view
		
	Scenario: url parameter is removed on logout
		Given I start the app on "/Start" using remote user "phigem"
		When I look at the screen
		And I click on navLogoutItem in nav.Home view
		Then I can see loginPage in Login view
		
		
		QUnit.module("Remote Login from external application");
		
		opaTest("Should force login if username is wrong", function(Given, When, Then) {
			// Arrangements
			Given.iTeardownMyApp().and.iStartTheApp({
				hash: "/Start/Statusmeldung/VS",
				illumLoginName: "bla"
			});
			
			// Actions
			When.onTheLoginPage.iLookAtTheScreen();
			
			// Assertions
			Then.onTheLoginPage.theAppShouldNotNavigateAndStayOnLoginPage();
		});
		
		opaTest("Should force login if username is not given", function(Given, When, Then) {
			// Arrangements
			Given.iTeardownMyApp().and.iStartTheApp({
				hash: "/Start/Statusmeldung/VS"
			});
			
			// Actions
			When.onTheLoginPage.iLookAtTheScreen();
			
			// Assertions
			Then.onTheLoginPage.theAppShouldNotNavigateAndStayOnLoginPage();
		});
		
		opaTest("Should not navigate to page", function(Given, When, Then) {
			// Arrangements
			Given.iTeardownMyApp().and.iStartTheApp({
				hash: "/Start/Statusmeldung/VS",
				illumLoginName: "phigem"
			});
			
			// Actions
			When.onTheLoginPage.iLookAtTheScreen();
			
			// Assertions
			Then.onStartOperationPage.theAppShouldNavigateToStartOperationPage();
		});
		
		opaTest("Should navigate to homepage on back navigation", function(Given, When, Then) {
			// Arrangements
			// Actions
			When.onStartOperationPage.iPressTheBackButton();
			
			// Assertions
			Then.onTheApp.shouldNavigateTo("Home");
		});