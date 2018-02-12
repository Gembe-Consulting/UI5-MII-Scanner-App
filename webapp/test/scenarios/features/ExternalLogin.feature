@wip
Feature: External Login using deep linking
	Users can login from an external application by passing 
	URL parameter "IllumLoginName" and the desired hash.
	The app should check if the user exists and redirect to the desired page.
	If the user does not exists, he should be redirected to login page.
@wip
	Scenario: Should force login if username is not given
		Given I start the app on "/Start" using remote user ""
		When I look at the screen
		Then I can see loginPage in Login view
@wip		
	Scenario: Should force login on deep linking if username is wrong
		Given I start the app on "/WE" using remote user "wrong_user_name"
		When I look at the screen
		Then I can see loginPage in Login view
@wip		
	Scenario: User can perform login and open deep page homepage
		Given I start the app on "/Start" using remote user "phigem"
		When I look at the screen
		Then I can see homePage in nav.Home view
@wip
	Scenario: url parameter is removed on logout
		Given I start the app on "/Start" using remote user "phigem"
		Given the url parameter "IllumLoginName" exists
		When I click on navLogoutItem in nav.Home view
		Then I can see loginPage in Login view
		And the url parameter "IllumLoginName" is removed
		Given I navigate to "/Start"
		Then I can see loginPage in Login view
@wip		
	Scenario: User can perform login and open deep page for goods movement
		Given I start the app on "/Materialbewegung" using remote user "phigem"
		When I look at the screen
		Then I can see goodsMovementPage in nav.GoodsMovement view
@wip		
	Scenario: User can perform login and open deep page status change
		Given I start the app on "/Statusmeldung" using remote user "phigem"
		When I look at the screen
		Then I can see statusChangePage in nav.StatusChange view
@wip		
	Scenario: User can perform login and open deep page for creating goods receipt
		Given I start the app on "/WE" using remote user "phigem"
		When I look at the screen
		Then I can see goodsReceiptPage in action.GoodsReceipt view
@wip		
	Scenario: User can perform login and open deep page for operation start
		Given I start the app on "/VS" using remote user "phigem"
		When I look at the screen
		Then I can see startOperationPage in action.StartOperation view