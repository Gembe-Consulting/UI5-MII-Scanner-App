# Changelog

All notable changes to this project will be documented in this file.

============================================================================================================
git log --after="2018-04-28T19:55:00+02:00" --pretty=format:"%s%n%b" --reverse --no-merges | grep -v '^$' | grep -v -i '\[INTERNAL\]' | grep -v -i '\[CHORE\]' | grep -v -i '\[TEST\]' | grep -v -i '\[STYLE\]'> build/LATEST_FEATURES_FIXES.md
git log --after="2018-04-28T19:55:00+02:00" --pretty=format:"%s%n%b" --reverse --no-merges | grep -v '^$' > build/LATEST_CHANGES.md
============================================================================================================

[<TYPE>] (<scope>): <subject>

<body>

<footer>

Allowed <TYPE> values:
- FEATURE (new feature for the user, not a new INTERNAL|CHORE type feature )
- FIX (bug fix for the user, not a INTERNAL|CHORE type fix )
- TEST (no production code change; adding missing tests, refactoring tests, etc )
- STYLE (no production code change; formatting, missing semi colons, etc )
- REFACTOR (no production code change; renaming methods, moving objects, etc )
- INTERNAL|CHORE (no production code change; changing dev environment, updating grunt tasks, etc )

Examples:

[FEATURE] (goods issue page): add, remove, change, replace, start ...
[FIX] (roller conveyor page): fix, repair, stop

============================================================================================================

##[1.3.8.2018-04-28]

[FEATURE] (statuschange nav): add tooltips
[TEST] (status change nav): add test cases for navigation
[TEST] (start operation): add basic test cases for UI
[FEATURE] (start op): initial implementation
[TEST] (mockserver): add support for mocked order operation service
[FEATURE] (start op): add more features
-read order data from MII backend 
-show order data in fragment
-refresh date input on show
[FEATURE] (start op): add status check of operation
[FEATURE] (start op): add more features
[TEST] (start op): add test cases
[FEATURE] (start op): add better order number and operation number validation
[TEST] (start op): add opa page object
[FEATURE] (start op): remove info fragment if order number is not found
[TEST] (start op):fix some test cases
[FEATURE] (start op): reset date on clear form
[FEATURE] (fnsh op). add basic functions
[FEATURE] (op action): add support for order incident service
[INTERNAL] (start+finish op): add posing example
[INTERNAL] version 1.3.0
[FIX] (manifest): correct path to MII Model lib
[TEST] (finish op): add basic test cases
[FEATURE] (info fragments): increase empty span on L-size to 2
[FEATURE] (finish op): add title icon and color
[FEATURE] (finish op): add title font style
[TEST] (finish op): fix typo
[FEATURE] (finish op): add basic translations
[TEST] (finish op): fix status number
[FEATURE] (finish op): prepare support for incident list
[FEATURE] (login): increase purge timer to 250ms
[FEATURE] (start/finish op): increase size of operation number input on small screens
[FEATURE] (start op): add posting support
[FEATURE] (start op): add operation start posting
[FEATURE] (order info fragment): remove partial conf dates
[FEATURE] (order info fragment): display dates formatted
[FEATURE] (info fragments): reduce emptySpanL to 3
[FIX] wrap fragment in FragmentDefinition
[FEATURE] (finish op): prepare input validation
[TEST] (start op): improve data quality
[FIX] (fnsh op): provide initial value for reduce()
[FIX] (fnsh op): convert start date to moment
[TEST] (fnsh op): fix test case 'started after entry date'
[FIX] (fnsh op): fix validation behavior
[FEATURE] (fnsh op): do not show error message if not incidents exist
[INTERNAL] (start op): simplify service call
[INTERNAL] (fnsh op): fix some test cases
[TEST] (start op): fix test case not reflecting correct strings
[FEATURE] (fnsh op): add support for posting service
[INTERNAL] (all op): rename stopped -> finish
[FEATURE] (fnsh op): add value state binding to date entry
[TEST] (fnsh op): add expected view model data
[FIX] (all op): fix correct order number for incident service
[TEST] (fnsh op): improve test data quality
[FEATURE] (fnsh op): display success message after posting
[TEST] add test cases for external data call
[INTERNAL] update to version 1.3.7
[TEST] rearrange test features
[INTERNAL] (build): adapt to new sapui5 best practice grunt build v 1.3.50
[FEATURE] (inter/resume op): add features for interrupt and resume
[REFACTOR] re-pack action pages to "tt" and "gm"
[TEST] (ext. call): fix order numbers for operation pages
[FEATURE] (all op): reactivate correct input validation
[TEST] add incident order operation
[FEATURE](res op): check if at least one interruption exists
[FEATURE] (res op): check incidents
[FEATURE] (res op): show current interruption
[FEATURE] (all op): add basic timeline support
[FEATURE] (res op): add more features
[FIX] (start op): fix function checkInputIsValid not implemented
[FIX] (int op): fix test case invalid -> valid order number
[TEST] (res op): fix view name
[FEATURE] (res op): add resource strings
[FEATURE] (int op): rearrange ui elements
[TEST] (res op): fix resource bundle strings
[FEATURE] (res op): add formatted date to message
[TEST] (res op): fix feature
[FEATURE] (res op): add string
[INTERNAL] [TRY] (all op): fix input validation on wrong user input format
[INTERNAL] update project files
[FIX] add moment as dependency
[FEATURE] (all) set bValid = false on parser error somewhere on page
[INTERNAL] project update
[INTERNAL] push SAPUI5 version to 1.54
[FEATURE] (all op): restrict date input to max = current and min = current - 7 days
[TEST] (all op): improve test cases
[FEATURE] (all op): improve date validation
[FEATURE] clear message manager on action page close
[FEATURE] (all op): improve date validation
[FEATURE] (status nav): hide start and finish items on mobile devices
[INTERNAL] version update

##[1.2.40.2018-03-31]

[FEATURE] (GR+GI) improved readability of storage location constraint
[FIX] fix model property to prevent parameterless load
[FEATURE] (action pages): improve form validation and message handling
[INTERNAL] (device): add defaults to device model to provide device-specific values
[TEST] add test cases for messages
[FIX] some issues after latest changes
[TEST] add test cases for service error handling
[TEST] add test case file for input validation
[INTERNAL] remove ressourceRoots mii.util from index file and replace by resourceRoots in manifest file
[INTERNAL] (component): prepare support for external application call
[FEATURE] (stock transfer + roller conveyor): ignore fatal error on initial goods receipt
[INTERNAL] provide test cases for bad service calls
[INTERNAL] (types): improve validation of null values
[FIX] (goods receipt/goods issue): fix nullpointer on empty save success
[FIX] (gr/gi) remove required flag
[INTERNAL] version bump

##[1.2.35.2018-03-18]

[INTERNAL] (base controller): add utility function for event bus
[INTERNAL] (base controller): add utility function for getting translations using parameters
[INTERNAL] (base controller): change nav back
[INTERNAL] (base controller): add utility function for getting component
[FEATURE] (action): add username as external user
[INTERNAL] version 1.2.30
[FIX] (roller conveyor): set storage bin item only if ressource id has been found
[FEATURE] (roller conveyor): cleanup success messages
[FEATURE] (action pages): add support for barcode scanner integration
Main logic is located on ActionPageController. Here we attach and detach the scanner event listener everytime a page is shown and hidden.
The attached event delegate evaluates the scanned string to discover the control.
[FEATURE] (roller conveyor): set stretcher default to true
[INTERNAL] version 1.2.35.2018-03-16
[FEATURE] (stock transfer); propagate ERP errors to user
[FEATURE] (action pages): re-align UI elements on large and medium screens
[FIX] (action pages): fix typo preventing providing username to MII transaction
[INTERNAL] (i18n): remove default language properties
[INTERNAL] snapshot version
[INTERNAL] (build): try fix build problems
[FIX] (stock transfer): show error message
[INTERNAL] replace ....sId by ....getId()
[INTERNAL] version 1.2.36.2018-03-17
[FIX] (goods receipt): fix too small storage location input on very large screens
[INTERNAL] (misc): refactor some eslint warnings
[INTERNAL] (misc): refactor some eslint warnings
[REFACTOR] (goods receipt): steamline and add polish to coding
also refactor 
adjust test features accordingly
[REFACTOR] (goods issue): steamline and add polish to coding
also refactor 
adjust test features accordingly
[FEATURE] (goods receipt): purge LE data if LENUM gets invalid
[FEATURE] (goods issue): purge LE data if LENUM gets invalid
[REFACTOR] (stock transfer): steamline and add polish to coding
also refactor 
adjust test features accordingly
[TEST] [FIX] (goods receipt): fix wording
[REFACTOR] (roller conveyor): steamline and add polish to coding
also refactor 
adjust test features accordingly
[INTERNAL] (build): revert build process
[INTERNAL] version 1.2.35.2018-03-18
[INTERNAL] version 1.2.35.2018-03-18


##[1.2.25.2018-03-11]
[REFACTOR] (component, rootView): improve id and manifest
[REFACTOR] (component, rootView): improve id and manifest
[TEST] (roller conveyor): update test cases for last unit
[INTERNAL] test theme designer
[FEATURE] (css): add custom font size for all input fields
[INTERNAL] (build): update grunt build
[FEATURE] (forms): optimize SimpleForm layout
- set breakpointM to 500 -> all below 500px will be considered SMALL and use alle ~S properties
- should display more devices as small form
[REFACTOR] (action): add ids to some controls
- header
- footer
- buttons
[FIX] (action): fix title not having correct style
[FEATURE] (action): increase font size on mobile devices
[INTERNAL] (grunt): fix eslint error fixed URL
[STYLE] (misc): stabilize ids and increase performance
[INTERNAL] (init): skip username check on debug
[FEATURE] (locale): add languages to prevent 404
[INTERNAL] (debug): add dummy user "DEBUG"
[INTERNAL] (init): set default logging to "WARNING"
[FEATURE] (goods issue): move bulk mat indicator to storage location line
[FEATURE] (roller conveyor + stock transfer): swap key and name in combobox
[FIX] (service): correct debug mode detection
[TEST] (goods issue). fix changed test features
[TEST] (stock transfer): fix changed test features
[FIX] (init): remove sap-ui-debug from localStorage to prevent cross session mess
[FEATURE] (roller conveyor): add better storage bin detection depending on dummy storage unit number
[FEATURE] (roller conveyor): add services for Roller Conveyor page
[INTERNAL] remove .che folder
[INTERNAL] (mii util): clean up miiutilities path
[INTERNAL] (eslint): add ES6 support
[FEATURE] (roller conveyor): add support for goods receipt of empty units
[FIX] (roller conveyor): prevent nullpointer if lenum is not found
[FEATURE] (service error): show MII transaction in error message
[FEATURE] (roller conveyor): add support for stock transfer posting
[FIX] (index): re-add correct path to mii utils
[FEATURE] (roller conveyor): add support for finding running process order
[FIX]: path to mii utils
[FIX] (roller conveyor): select correct storage bin item on dummy LE
[FEATURE] (coller conveyor): add support for posting BwA 555
[FEATURE] (roller conveyor): add busy state during service calls & clear form after
[TEST] (mockdata): repair mockdata files to match service names
[INTERNAL]: version bump


##[1.2.0.2018-02-18]
[FEATURE] (roller conveyor): detect last unit and repair user input if required
[FEATURE] (roller conveyor): detect last unit and show message
[TEST] (roller conveyor): add tests to validate last unit logic
[FEATURE] (roller conveyor): convert entered unit into uppercase
[TEST] (roller conveyor): prepare final test cases
[REFACTOR] (roller conveyor): move isLastStorageUnit to formatter and add isNotLastStorageUnit formatter
[REFACTOR] (login): make var to const
[FEATURE] (login): rework how this app handles login and authentication
There are two scenarios to consider: Navigation from Mobile device and form Desktop device.
From a desktop, we always navigate to a deep page like "/Start" or "/WE" (= not login page). Users are always authenticated by SAP NetWeaver.
However, from a mobile device, we always navigate to "/Anmeldung" (= login page) while being authenticated by SAP NetWeaver using an default dummy user. This is why we force the user to enter his username. On successful login, we set the user model. To prevent navigation to a deeper page without an user model, all pages are based on PageBaseConroller that attaches a onBeforeNavigation event. Each time this even triggers, we check if the user model is set and valid. If not, we navigate to login page.
To prevent desktop devices to be forced to navigatio to login page, we will read the IllumLoginName and fire a validation request to MII.
[TEST] (unit): remove empty file
[TEST] (login): add several test to validate login and authentication behaviour
[FIX] (roller conveyor): misspell in binding to check storage unit empty or full
[FIX] (formatter): fix typo in storage unit empty/full formatter
[TEST] (login): renew test cases to be better in general
[FIX] (formatter): make isNotLastStorageUnit more atomic
[TEST] (all): increase performance
[INTERNAL] update version
[INTERNAL] update version
[TEST] (index): add option to start app with external UI5 library by using index-ext.irpt
[FEATURE] (home): remove back navigation and hise Logout item on desktop devices
[FIX] (roller conveyor): fix not being able to lint "=>" operator
[INTERNAL] (grunt): fix text replace task
[FEATURE] (formatter): add null-check to last storage unit formatter
[INTERNAL] (component): add missing semicolon
[INTERNAL] (component): no statement in return
[INTERNAL] (project): update settings
[STYLE] (component): remove newline and unused var
[TEST] (opa): fix typo
[INTERNAL] (mockserver): set delay to 1000ms
remember to set &serverDelay=0 when doing opa tests
[FEATURE] (models): add error messages to all models
also add message toasts on request complete when debugging is active
[TEST] (navigation): adopt latest changes to logout removal on desktop devices
[FEATURE] (roller conveyor): prepare posting support
[INTERNAL] update version to 1.2.0.2018-02-18


##[1.1.90.2018-02-15]
[INTERNAL][FIX] replace 'is' property check with 'being'
[FIX] Not comparing css color properly (rgb vs hex)
[FIX] Compare initial quantity to '' (instead of 0,000)
[FIX] Ensure to update view controls if quantity has been cleared
[FIX] Don't override previous user quantity input with storage unit data
[FIX] Wrong control id in test feature
[FIX] Check uom input against component uom
[INTERNAL] Fix lint errors
[FIX] Not calculating remaining quantity on empty quantity value
[INTERNAL] Project update
[FEATURE] Show message box after detected scan
[FEATURE] Add support for storage location and order number in Goods Receipt page
[INTERNAL] Change readme.md  -rename to REDAME.md  -add commit message format
[INTERNAL] Change readme.md  -rename to REDAME.md  -add commit message format
[INTERNAL] Create CHANGES.md
[INTERNAL] Add CHANGELOG.md to project
[FEATURE] (goodsissue) Add custom colorized header with icons
[FEATURE] (stocktransfer) Add custom colorized header with icon
[INTERNAL] Replace icon size by sapUiSmallMarginEnd
[FEATURE] (rollerconveyoer) Add custom colorized header with icon
[FIX] Adjust page title to navigation
[FEATURE] Improve visual appearance
- Add Shell container to app for better desktop support
- Add top margin to goods movement navigation page
- Add margin between icon and test in goods movement page
- Remove footer containing user name from List control
- Add footer containing username to Page control
[FEATURE] Re-align quantity input and uom
[INTERNAL] Prevent grunt build on git push
[FEATURE] Implement roller convoyer
-Add and wire ui controls
-Add completness check
-Add storage unit validation
[INTERNAL] Prevent grunt build on git push and line break on chained methods
[FEATURE] Improve Roller Conveyor Page
-Add basic test scenario
-Add test support for ui controls
-Add test support for data and view model
[FIX] Prevent posting with wrong storage unit number or order number
Fixes if users invalidate the entered storage unit number or process order number, posting button ist still active (if button was active before).
Affected pages:
- Goods Receipt
- Goods Issue
Stock transfer is not affected, because non-existing storage unit is handled using initial storage unit object. This method does also allow to hide storage unit info fragment.
[TEST] Set external login feature as WIP
[FIX] Missing }
[STYLE] Reformat chained methods
[STYLE] Reformat chained methods
[FEATURE] Add most important test cases
[FEATURE] Accept 90000000000000000000 as storage unit indicating last unit
[FEATURE] Disable Rollenbahn and Stapler if users enter last unit
[FEATURE] Add logic to switch between full, empty and last LE
-Repair pre-selected storage bin on change to last LE
-Repair entry quantity and unit
[FIX] Make emptyStorageUnit formatter detect null as empty
[INTERNAL] Cleanup formatter code
[INTERNAL] Remove content of prepareUserModel form models.js
[INTERNAL] Replace full qualified name by shortcut
[TEST] Add missing test for null, undefined and ''
[FIX] Detect null, undefined and '' as empty unit
[INTERNAL] Fix typo in comment
[INTERNAL][TEST][STYLE] Adding some tests and beautify some files
[Internal] Version update
[INTERNAL] Update chnagelog
[INTERNAL] Update changelog
[TEST] Fix feature
[STYLE] Fix missing semicolon
[INTERNAL] Build
[INTERNAL] Update Build properties
[INTERNAL] Update readme and changelog
[INTERNAL] Add latest features and fixes as separate logs
[INTERNAL] add latest features and fixes as separate logs and update changelog
[INTERNAL] (eslint): update linting rules
[INTERNAL] (build): update grunt build
[TEST] (action): add test step to check for initial data/view model
[TEST] (roller conveyor): replace ' with "
[TEST] (goods receipt): add test for view model and data model
[TEST] (goods receipt): replace ' with "
[STYLE] (goods issue): replace ' with "
[TEST] (goods issue): add test for view model and data model
[TEST] (stock transfer): add test step file
- add test for initial UI elements
- add test for view model and data model
[TEST][FIX] (action pages): Fix syntax error after ' -> " convertion
[TEST] (common): remove navigation action (use generic gherkin step instead)
[TEST] (all): rework to prevent breaking DRY guideline
[INTERNAL] (manifest, i18n): Rework routing pattern and title to be retrieved from resource bundle
[TEST] (routing, navigation): Adjust all navigation tests to new pattern
[Test] (goods issue): Fix incomplete initial data
[FIX] (stock transfer): Try to fix targetStorageBinItemSelection being "" instead of null
[INTERNAL] (eslint): ignore dist folder
[INTERNAL] (component): add eslint global "document"
[TEST] (opa, login). remove check for navigation on login page
This check is not needed on desktop devices
[Test] (goods issue): add test for initial view object for both nonLE and withLE
[TEST] (pages): add return statement
[TEST] (goods issue): refactor initial input field check to be more DRY
[STYLE] (roller conveyor): refactor some control ids and data property names
[STYLE] (roller conveyor): refactor some control ids and data property names
[STYLE] (stock transfer): adopt naming conventions on ids and properties
[STYLE] (goods issue): adopt naming conventions on ids and properties
[INTERNAL] (action pages): add missing maxLength properies
[INTERNAL] (git): try to ignore .che/project.json
[FIX] (stock transfer): remove maxLength property from storageBin selection (not supported)
[FEATURE] (action navigation pages): remove gap between items
[FEATURE] (action pages): increase font size of clear quantity icon on mobile devices
[FEATURE] (action nav): add small margin to text
[FEATURE] (goods receipt): propose default unit of measure
- set KG if storage location is not 1000 and uom was not entered before 
- clear  if storage location is 1000
[FEATURE] (goods issue): remove leading zero after LE validation
[FEATURE] (stock transfer): hide clear quantity icon, if LE is not empty
Fixes being able to clear quantity, even if quantity input is not editable
[TEST] (goods issue): rename OPA feature

## [1.1.75.2018-02-08]
FIX] Unit of measure is not discovered from order component after material entry
[FIX] Not purging unit of measure if uom does not match
-This will prevent save button beeing editable if uom differ. We compare MEINH from storage unit with EINHEIT from component
[TEST] Fix combobox selection not working
-We send an ENTER key press afterwards
[ADD] Clear quantity input field when clear icon is clicked
[INTERNAL] Remove sap-no-hardcoded-url from lint
[FIX] Missing property
[INTERNAL] Update version
[INTERNAL] Update version
[FEATURE] Re-phrase goods movement menu items
-As per customer request, we changed labels. We also added gherkin test features.
[FEATURE] Include test cases from customer feedback for the following changes
[CHANGE] Rename all cancel buttons on action pages
[ADD] Add clear icon for each quantity input field
[REMOVE] Delete order number, actual quantity and target quantity from stock transfer
[ADD] Include actual quantity to storage unit fragment
[INTERNAL][FIX] replace 'is' property check with 'being'
[FIX] Not comparing css color properly (rgb vs hex)
[FIX] Compare initial quantity to '' (instead of 0,000)
[FIX] Ensure to update view controls if quantity has been cleared
[FIX] Don't override previous user quantity input with storage unit data
[FIX] Wrong control id in test feature
[FIX] Check uom input against component uom
[INTERNAL] Fix lint errors
[FIX] Not calculating remaining quantity on empty quantity value
[INTERNAL] Project update
[INTERNAL] Change readme.md  
-rename to REDAME.md  
-add commit message format

## [1.1.65.2018-02-06]
[INTERNAL] Optimize Grunt build
- Remove unnecessary tasks
- Remove test folders from dist by using .project.json
[INTERNAL] Do code cleanup
[INTERNAL] Delete generic steps from test folder (moved to external lib)
[INTERNAL] Reorganize generic test steps
- Add openui5genericapptesting to resourceroots
- Add route path to neo-app
- Update build process
[TEST] Fix some test case descriptions
[FEATURE] Add posting feature
[FEATURE] Add input validation before posting
[FEATURE] More Stock Transfer features
[FEATURE] Initial implementation of Stock Transfer page
[FEATURE] Improve Login behavior by using IllumLoginName mapping in irpt
[INTERNAL] Version Update
[FEATURE] Adjusting Business logic GR
-enable order number validation
-enable storage unit number validation 
[FEATURE] Adjusting Business logic GI 
- allow out-of-date batches to be used (warning)
- allow backflushed withdrawal

## [1.0.0] 
Optimizing Grunt build
Evaluate IllumLoginName in irpt site
Enable annonymous login if device is desktop
Fix onInit from super class not applied to action pages
Minor build adjustment
Version update
Optimizing Grunt build tasks
version update
update Grunt build
Add version support during grunt build
Fixing wrapping attribute
Enable grunt version update
Enable value state handling
read order header data on input
Improve lgort type
Enable lgort on non LE use cse
Add lableTextFormGoodsIssueBulkMaterialTooltip
Add GR posting use case
Enable goods issue posting service
Shorten unit of measure string
Add VBox to GR view to match GR view
Change title depending on WA type
Improve LE Info fragment
Fix reading UoM
Replace Login Bar with Toolbar
Update build data
Add test content to build
Add support for unplanned withdrawal and backflushed component check
Improve readability of special stock indicators
Fix to quantityInput testcase not reflacting actual test data
Add support for external input fields
Separate GR and GI test cases better
Suspend deep link with wrong user test cases
Add support for GetOrderComponentQry service call
Add support for order component checks
Refactor storage unit model and main data model. Move ExpirationDate foramtter to formatter module
set @wip for scenarios under construcion
Add Expiration Date validation
Add support for Special Stock Indicator
Enable storage unit info form
Check if posting is allowed
move _formatStorageUnitData to main class to be reusable
add storage unit change event add message strip add initial quantity value in feature file
fix feature to be storage location
rework storage unit service to be usable in both GR and GI
Update External login feature
Add some generic test steps Extend GI feature scenario
only add scanner detection if device is not desktop
Improve test cases - fix GR test feature - add GI test feature - add i hit key generic test step
Setup initial goods issue test cases
Restore project.json
Rework grunt build
Add version info
Fix not having a control on unknown scanner input
Remove UI5 scanner detection We will stick to the native jQuerey plugin for now
Fix keeping message strip after success
Change version info
Switch operation action pages to actual controllers Instead of dummy controller class
Prapare for Publish to MII
Finalizing GoodsReceipt features
Fixing UI behavior of save button
Changes to scanner detection
Add semantic barcode detection
Add Unit tests to barcode detection
Add scanner detection library
Add error message for already posted storage units
Finalize test features for GoodsReceipt page
Prepare some tests for GoodsReceipt page
Adjust quantity input position
Adjust some locales
add switch control
Update i18n strings
Adjust visible input fields
Add routing parameters
Add query parameter for more routing pattern
Add support for router dependent view manipulation
Add support for query parameters by routing
Add stock transfer page
Reformatting
Reformatting
Add some localizations
Add basic UI controls
Introduce SAP data types
Rework private vars
Hide form, if no data available
Fix after refactoring
Add i18n for storage unit fragment
Finalize GR action page ui + refactor storageBin to StorageUnit
Modify iCanSee and iEnterText feature
Add mockservice
Adjust label width
Enable wrapping on nav info text
Enable basic input handling + mockdata + Refresh data
Update resourceRoots
Add openui5.validator dependency
Replace ajv with openui5 validator based on ajv
Added some unit tests
Add RollerConvoyer controller
Add StockTransfer controller
Add GoodsIssue controller
Add data model
Add goodsReceipt controller
Update i18n strings
Add new scenarios
Add Check for UI presence
Add goods receipt test cases
rename assertiations for url param check
Fix looking for window.location within iFrame
Fix test case removing url parameter
Improve test cases
Update test to use gherkin Refactor all existing tests and introduce gherkin tests
Add test cases for external login via URL parameter
Prepare test support for upcoming features.
Add scanner specific integration tests
Enable Integration test for login (desktop) and basic navigation
Repair testing files after merge
Add iDelay parameter
Add iDelay parameter
Add testing files
Add testing files
Purge input after a duration of 100ms
improve Promise usage
Improve Promise handling.
Rework async calls
Enable async user login request - Use Promise() - Show BusyIndicator
Add AVJ library
Fix
Test new MII Model
Adjusting coding to SAP MII environment
remove mis-located file
Moving auto login to Component.js
Add auto login in case url param is given if IllumLoginName is given, we check if user is authorizes and perform a autologin.
Add moment as component dependency
Remove min files from resource list Grunt build should take care of minification
adjust moment require
Add momentjs using LibraryManager
Add lodash using LibraryManager
remove libraries
Add libraries using LibraryManager
Add momentjs library and set locale
Show on Interrupt Op, too
Add SubHeader for desktop devices only
Add .che
Add Combobox to action pages
Add Combobox to action pages
Update new Grunt build

## [0.0.1] 
Cleanup commit.
next commit 2
next commit.
web ide only?
next change 2
next change
Update repo.
Adjusting navigation
Restore some important features after server crash
...
Initial commit to github. Most of its features working.
Initial commit
